# 08 - MIGRATION PLAN

## This phase (wave 2 - after the nine docs)
1. DB: public_id backfill; 20-state constraint; section-23 tables; catalog
   import flagged unverified; session_proposal returns public_id.
2. Routes: /e/[token] dual-lookup entry; /proposal/invite -> /e redirect;
   /client/proposals/[publicId] workspace; /proposal/[uuid] session redirect;
   /admin/* -> /ops/* with redirects; cookies re-scoped to Path=/ (old
   path-scoped cookies force one re-login/re-verify - accepted, documented).
3. proxy matcher + chromeless prefixes updated IN THE SAME COMMIT (no
   unprotected deploy window).
4. PRICING.approved extraction (bundle leak fix).
5. Full curl matrix re-run locally + on production before/after deploy.

## Known risks (from gap audit)
- Cookie path scoping: old /proposal + /admin cookies stop matching after
  rename -> handled by Path=/ reissue; users re-authenticate once.
- /e collision: legacy possession tokens vs invitation tokens are
  shape-identical -> dual-lookup order invitation-first, legacy logged;
  sunset by rotating/revoking legacy tokens later.
- Status constraint: RPC bodies live in the DB - every status-writing
  function is re-applied with the new state set in the same migration.
- estimate_no frozen; public_id is additive - no renumbering, audit trails
  intact.
- Two Claude sessions share the tree (check mtimes; exclude decks/).
- Git auto-deploy broken: deploy is manual vercel --prod; commit BEFORE
  deploying so code and prod cannot diverge.
- No email provider: OTP path fails closed; email-confirm is default.

## Later phases (unchanged sequence)
Phase 2 admin core (/ops shell, dashboard, clients, projects, proposals
detail tabs) -> Phase 3 catalog/pricing/rules editors + ortho image wave ->
Phase 4 client workspace steps + autosave + uploads -> Phase 5 proposal
editor (categorized line items, ACP editor mechanics translated) -> Phase 6
web proposal + PDF -> Phase 7 signature + notifications -> Phase 8
testing/hardening (the master section 34 matrix; security subset already
automated via curl this session).
