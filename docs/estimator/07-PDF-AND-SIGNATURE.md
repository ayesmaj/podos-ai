# 07 - PDF AND SIGNATURE
PDF: @react-pdf/renderer server-side, 13-page structure per master section
15, one structured source feeding web proposal AND PDF (ACP's hand-synced
duplicate layouts are the anti-pattern to avoid; their print-CSS
window.print flow is not acceptable as production PDF). Per document:
number, version, dates, page numbers, sha-256 checksum, status, watermark
CONFIDENTIAL - PREPARED FOR [COMPANY] - [EMAIL], conceptual-visualization
disclaimer. Storage: private bucket, proposal-scoped paths, signed
short-lived URLs, downloads audited, regeneration = new version.

Signature: provider adapter (createRequest/getStatus/verifyWebhook/
fetchSignedPdf/fetchAuditCert). DevProvider = current sign_via_session
(identity-attached acknowledgement, labeled as such; ACP's canvas dataURL
pattern is NOT carried as the legal mechanism). DropboxSignProvider when
the founder purchases the account (09-BUSINESS-DATA A2). At completion:
lock the version snapshot (ACP lockRevision pattern), store signed PDF +
audit certificate + hash, optional countersignature.
