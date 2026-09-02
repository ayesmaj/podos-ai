import { SITE } from "@/lib/seo/site";

/**
 * proposals.ts — client-facing proposal emails (invitation to configure,
 * proposal released). Sent via Resend when RESEND_API_KEY is configured;
 * otherwise returns { sent: false, reason } so the admin UI can show the
 * secure link to send by hand. Rules: no pricing in subject or body, the
 * link is the only secret, plain HTML that renders everywhere.
 */

if (typeof window !== "undefined") throw new Error("src/lib/email/proposals.ts is server-only");

export type ProposalMode = "client_configured" | "admin_built";
export interface SendResult { sent: boolean; id?: string; reason?: string }

export function isEmailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}

function shell(title: string, body: string): string {
  return `<!doctype html><html><body style="margin:0;background:#F7F9FB;font-family:Inter,Segoe UI,Arial,sans-serif;color:#0F172A">
<div style="max-width:560px;margin:0 auto;padding:32px 20px">
  <img src="${SITE.baseUrl}/logo.png" alt="PODOS AI" width="132" style="height:44px;width:auto;display:block;margin-bottom:24px" />
  <div style="background:#fff;border:1px solid #E2E8F0;border-radius:16px;padding:28px">
    <p style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#1D4ED8;margin:0 0 10px;font-weight:600">Confidential</p>
    <h1 style="font-size:22px;line-height:1.2;margin:0 0 14px;letter-spacing:-.02em">${title}</h1>
    ${body}
    <p style="font-size:12px;color:#94A3B8;line-height:1.6;margin:24px 0 0">This link is personal to you and should not be forwarded. Access is recorded. If you were not expecting this message, you can ignore it.</p>
  </div>
  <p style="font-size:11px;color:#94A3B8;margin:16px 0 0">PODOS AI · podosai.com</p>
</div></body></html>`;
}

function button(href: string, label: string) {
  return `<p style="margin:22px 0"><a href="${href}" style="display:inline-block;background:linear-gradient(120deg,#1D4ED8,#2563EB);color:#fff;text-decoration:none;font-weight:600;padding:14px 22px;border-radius:10px;font-size:15px">${label} →</a></p>
<p style="font-size:12px;color:#64748B;word-break:break-all;margin:0">Or copy this link: ${href}</p>`;
}

export function invitationEmail(i: { mode: ProposalMode; company: string | null; project: string | null; recipientName: string | null; token: string }) {
  const link = `${SITE.baseUrl}/e/${i.token}`;
  const who = i.recipientName ? `Hello ${i.recipientName},` : "Hello,";
  const proj = i.project ? ` for <strong>${i.project}</strong>` : "";
  if (i.mode === "client_configured") {
    return {
      subject: `Your private PODOS configuration workspace${i.project ? ` — ${i.project}` : ""}`,
      html: shell("Your PODOS configuration workspace is ready", `
        <p style="font-size:15px;line-height:1.6;color:#334155;margin:0">${who}<br/>PODOS has prepared a confidential configuration workspace${proj}${i.company ? ` at <strong>${i.company}</strong>` : ""}. Use the guided menu to define your modular AI infrastructure deployment — it takes about 10–15 minutes and you can save and return anytime.</p>
        ${button(link, "Open your private workspace")}`),
    };
  }
  return {
    subject: `Your PODOS proposal${i.project ? ` — ${i.project}` : ""}`,
    html: shell("Your PODOS proposal is ready to review", `
      <p style="font-size:15px;line-height:1.6;color:#334155;margin:0">${who}<br/>PODOS has prepared a confidential proposal${proj}${i.company ? ` for <strong>${i.company}</strong>` : ""}. Open your secure link to review the configuration, scope and commercial summary, and download the PDF.</p>
      ${button(link, "View your proposal")}`),
  };
}

export function releasedEmail(i: { company: string | null; project: string | null; recipientName: string | null; token: string }) {
  const link = `${SITE.baseUrl}/e/${i.token}`;
  const who = i.recipientName ? `Hello ${i.recipientName},` : "Hello,";
  return {
    subject: `Your PODOS proposal is ready${i.project ? ` — ${i.project}` : ""}`,
    html: shell("Your PODOS proposal is ready", `
      <p style="font-size:15px;line-height:1.6;color:#334155;margin:0">${who}<br/>Your proposal${i.project ? ` for <strong>${i.project}</strong>` : ""}${i.company ? ` (${i.company})` : ""} has been reviewed and released by PODOS. Open your secure link to review it and download the PDF. When signature is enabled you will be able to accept it there as well.</p>
      ${button(link, "View your proposal")}`),
  };
}

export async function sendProposalEmail(to: string, msg: { subject: string; html: string }): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { sent: false, reason: "RESEND_API_KEY is not configured" };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.NOTIFY_FROM ?? "PODOS AI <onboarding@resend.dev>",
        to: [to], subject: msg.subject, html: msg.html,
      }),
    });
    if (!res.ok) return { sent: false, reason: `provider responded ${res.status}` };
    const json = (await res.json()) as { id?: string };
    return { sent: true, id: json.id };
  } catch (err) {
    return { sent: false, reason: err instanceof Error ? err.message : "network error" };
  }
}
