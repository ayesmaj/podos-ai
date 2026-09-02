"use client";

import { UserPlus } from "lucide-react";
import Drawer from "@/components/ops/ui/Drawer";
import s from "@/components/ops/ui/ops.module.css";
import { inviteContactAction } from "../actions";

/**
 * "New link" drawer — issues a personal secure link to one of the client's
 * contacts through the same inviteContactAction (fields: estimateNo, publicId,
 * mode, company, project, contactId, policy). The link itself is revealed once
 * by InviteOutcome on the page, never here.
 */
export default function InviteDrawer({ estimateNo, publicId, mode, company, project, contacts }: {
  estimateNo: string; publicId: string; mode: string; company: string; project: string;
  contacts: { id: string; label: string }[];
}) {
  return (
    <Drawer
      title="New secure link" subtitle="Each person gets their own secret link, stored as a hash and shown once after it is issued."
      trigger={(open) => <button type="button" className={`${s.btn} ${s.btnSecondary} ${s.btnSm}`} onClick={open}><UserPlus size={14} aria-hidden /> New link</button>}
      footer={(close) => (
        <>
          <button type="button" className={`${s.btn} ${s.btnGhost} ${s.btnSm}`} onClick={close}>Cancel</button>
          <button type="submit" form="invite-form" className={`${s.btn} ${s.btnPrimary}`}><UserPlus size={16} aria-hidden /> Issue link</button>
        </>
      )}
    >
      {(close) => (
        <form id="invite-form" action={async (fd) => { await inviteContactAction(fd); close(); }} style={{ display: "grid", gap: 14 }}>
          <input type="hidden" name="estimateNo" value={estimateNo} />
          <input type="hidden" name="publicId" value={publicId} />
          <input type="hidden" name="mode" value={mode} />
          <input type="hidden" name="company" value={company} />
          <input type="hidden" name="project" value={project} />
          <label className={s.field}>Contact
            <select name="contactId" required defaultValue="" className={s.input}>
              <option value="" disabled>Choose a contact…</option>
              {contacts.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </label>
          <label className={s.field}>Access policy
            <select name="policy" defaultValue="email-confirm" className={s.input}>
              <option value="email-confirm">Email confirmation</option>
              <option value="otp">One-time code (email OTP)</option>
            </select>
          </label>
          <p className={s.muted} style={{ fontSize: 13 }}>The link is emailed when a provider is configured; either way it is shown to you once so nothing stalls.</p>
        </form>
      )}
    </Drawer>
  );
}
