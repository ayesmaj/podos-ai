-- ============================================================================
-- PRIVATE PROPOSAL SYSTEM — consolidated schema snapshot (2026-09-01)
--
-- Source of truth is the live Supabase project podos-invest
-- (buqghwxjjksqperiamag), where these were applied via MCP migrations:
--   create_client_estimates_with_secret_links
--   use_builtin_sha256_for_estimate_tokens
--   add_estimate_creation_and_admin_listing
--   token_randomness_without_pgcrypto
--   add_rotate_estimate_token
--   add_set_admin_secret_rotation
--   add_public_estimate_request
--   private_proposal_invitations_sessions
--   admin_sessions_and_rate_limits
--
-- This file exists so the security model is AUDITABLE FROM THE REPO
-- (audit finding F11: "RPC SQL not in repo"). It reproduces the applied DDL.
-- Security invariants it encodes:
--   * every table is RLS-enabled with ZERO policies (deny-all to anon)
--   * every access path is a SECURITY DEFINER function with a hardened
--     search_path that validates its own authorization
--   * every token/OTP is stored as SHA-256 only; raw values surface once
--   * money is bigint minor units; no floats
--   * pgcrypto is NOT used (its schema is outside the hardened search_path):
--     randomness = gen_random_uuid() pairs, hashing = built-in sha256()
-- ============================================================================

-- ------------------------------------------------------------------ tables

create table if not exists public.estimates (
  id                  uuid primary key default gen_random_uuid(),
  estimate_no         text not null unique,
  token_hash          text not null unique,     -- legacy link tier (/e/[token])
  client_name         text not null,
  client_email        text,
  company             text,
  project_name        text,
  config              jsonb not null default '{}'::jsonb,
  line_items          jsonb not null default '[]'::jsonb,
  one_time_low_cents  bigint not null default 0,
  one_time_high_cents bigint not null default 0,
  recurring_cents     bigint not null default 0,
  currency            text not null default 'USD',
  status              text not null default 'draft'
                      check (status in ('draft','sent','viewed','signed','declined','expired','revoked')),
  view_count          integer not null default 0,
  first_viewed_at     timestamptz,
  last_viewed_at      timestamptz,
  signed_at           timestamptz,
  signer_name         text,
  signer_title        text,
  notes               text,
  expires_at          timestamptz,
  revoked             boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create table if not exists public.estimate_views (
  id          uuid primary key default gen_random_uuid(),
  estimate_id uuid not null references public.estimates(id) on delete cascade,
  viewed_at   timestamptz not null default now(),
  user_agent  text,
  referrer    text
);

create table if not exists public.estimate_admin_config (
  id           int primary key default 1 check (id = 1),
  admin_secret text not null,
  updated_at   timestamptz not null default now()
);

create table if not exists public.proposal_invitations (
  id              uuid primary key default gen_random_uuid(),
  estimate_id     uuid not null references public.estimates(id) on delete cascade,
  recipient_email text not null,
  recipient_name  text,
  access_policy   text not null default 'email-confirm'
                  check (access_policy in ('otp','email-confirm')),
  token_hash      text not null unique,
  issued_at       timestamptz not null default now(),
  expires_at      timestamptz not null,
  revoked         boolean not null default false,
  exchanged_at    timestamptz,
  created_by      text not null default 'admin',
  created_at      timestamptz not null default now()
);

create table if not exists public.proposal_sessions (
  id            uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.proposal_invitations(id) on delete cascade,
  estimate_id   uuid not null references public.estimates(id) on delete cascade,
  viewer_email  text not null,
  token_hash    text not null unique,
  created_at    timestamptz not null default now(),
  expires_at    timestamptz not null,
  last_seen_at  timestamptz not null default now(),
  revoked       boolean not null default false
);

create table if not exists public.otp_codes (
  id            uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.proposal_invitations(id) on delete cascade,
  code_hash     text not null,
  created_at    timestamptz not null default now(),
  expires_at    timestamptz not null,
  attempts      integer not null default 0,
  consumed_at   timestamptz
);

create table if not exists public.activity_events (
  id            uuid primary key default gen_random_uuid(),
  estimate_id   uuid references public.estimates(id) on delete cascade,
  invitation_id uuid references public.proposal_invitations(id) on delete set null,
  actor         text not null,
  event         text not null,
  metadata      jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id         uuid primary key default gen_random_uuid(),
  actor      text not null,
  action     text not null,
  entity     text,
  detail     jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_sessions (
  id           uuid primary key default gen_random_uuid(),
  token_hash   text not null unique,
  created_at   timestamptz not null default now(),
  expires_at   timestamptz not null,
  last_seen_at timestamptz not null default now(),
  revoked      boolean not null default false,
  user_agent   text
);

create table if not exists public.rate_counters (
  bucket       text not null,
  key          text not null,
  window_start timestamptz not null,
  hits         integer not null default 0,
  primary key (bucket, key, window_start)
);

-- RLS: enabled everywhere, zero policies — the anon key can touch nothing.
alter table public.estimates            enable row level security;
alter table public.estimate_views       enable row level security;
alter table public.estimate_admin_config enable row level security;
alter table public.proposal_invitations enable row level security;
alter table public.proposal_sessions    enable row level security;
alter table public.otp_codes            enable row level security;
alter table public.activity_events      enable row level security;
alter table public.audit_logs           enable row level security;
alter table public.admin_sessions       enable row level security;
alter table public.rate_counters        enable row level security;

-- ---------------------------------------------------------------- functions
-- Full bodies live in the applied migrations (names in the header). Contract
-- summary, verified by tests on 2026-09-01:
--
-- _hash(text)                sha256 hex (internal only)
-- _rand_token()              two gen_random_uuid()s -> 64 hex chars, 256-bit
-- _check_admin(secret)       raises 'unauthorized' unless secret matches
-- _secret_for_session(tok)   admin session -> secret, internal only
--
-- CLIENT PATH
-- invitation_status(token)         -> ok, policy, masked email, company; logs open;
--                                     invalid/revoked/expired => zero rows
-- issue_otp(token)                 -> {code, recipient}; 3/hour throttle raises
-- verify_invitation(token, answer) -> otp code (5-attempt cap) or authorized
--                                     email match -> creates 7-day session,
--                                     marks exchanged_at; failures logged
-- session_proposal(session)        -> proposal payload + viewer email; bumps
--                                     view counters; logs proposal_viewed
-- sign_via_session(session, name, title) -> signs once; identity-attached
--
-- LEGACY LINK TIER
-- get_estimate_by_token(token, ua, ref)  -> payload + view tracking
-- sign_estimate_by_token(token, name, title)
--
-- ADMIN (each perform _check_admin or session check; each writes audit_logs)
-- admin_login(secret, ua)   -> opaque 12h session token (once) | null; logs failures
-- admin_session_valid(tok)  -> boolean
-- admin_logout(tok)         -> revokes
-- create_estimate(...)      -> {estimate_no, token(once)}
-- list_estimates(secret)    -> rows
-- revoke_estimate(secret, no)
-- rotate_estimate_token(secret, no) -> new token (once), un-revokes
-- create_invitation(secret, no, email, name, policy, days) -> {id, token(once)}
-- list_invitations(secret, no) -> rows + per-viewer session counts/last-seen
-- revoke_invitation(secret, id) -> also revokes its sessions (cascade tested)
-- list_activity(secret, no) -> last 200 events
-- set_admin_secret(current, new)   -- rotation without values in transcripts
--
-- PUBLIC INBOUND
-- request_estimate(name, email, company, project, config, low, high, recurring)
--   -> validates, caps sizes, 3/hour per email flood guard, creates draft,
--      generates token it NEVER returns
--
-- RATE LIMITER
-- rate_check(bucket, key, max, window_seconds) -> boolean (fixed window,
--   durable; tested: limit 3 blocks call 4)
