# PDF_AND_SIGNATURE_PLAN.md

## PDF
Renderer: @react-pdf/renderer server-side (pure Node, Vercel-safe; never
browser screenshots), 13-page structure per brief section 9, fed by the same
structured proposal data as the web preview. Per document: number, version,
issue/expiry dates, page numbers, sha-256 checksum, PRELIMINARY or APPROVED
state, conceptual-visualization disclaimer, dynamic watermark
CONFIDENTIAL - PREPARED FOR [COMPANY] - [VIEWER EMAIL]. Storage: Supabase
Storage private bucket proposals/, paths scoped by estimate id; signed
short-lived download URLs; every download recorded to activity_events;
regeneration creates a new version, never overwrites. Preview UI: page
thumbnails, zoom, prev/next; web preview and file match because both render
the same data.

## Signature
Adapter interface SignatureProvider (createRequest, getStatus, verifyWebhook,
fetchSignedPdf, fetchAuditCert) with two implementations: DevProvider (the
current sign_via_session - identity-attached via verified session, adequate
for acknowledgement signatures and labeled as such) and DropboxSignProvider
(embedded signing, access codes, reminders, webhooks) - account/key is a
founder purchase (BUSINESS_DATA_REQUIRED section A5). Stored per request:
provider ids, signer identity/status timestamps, document hash, signed PDF +
audit-certificate locations. Optional PODOS countersignature after client
completion. A hand-drawn canvas is NEVER presented as the binding e-sign
mechanism.
