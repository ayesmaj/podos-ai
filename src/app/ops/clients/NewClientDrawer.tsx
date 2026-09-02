"use client";

import { Building2 } from "lucide-react";
import Drawer from "@/components/ops/ui/Drawer";
import s from "@/components/ops/ui/ops.module.css";
import { newClientAction } from "./actions";

/** "+ New client" right-side drawer: the minimum to create the record; details are edited on the client page. */
export default function NewClientDrawer() {
  return (
    <Drawer
      title="New client" subtitle="Create the company first; contacts, projects and proposals are added on its page."
      trigger={(open) => <button type="button" className={`${s.btn} ${s.btnPrimary}`} onClick={open}><Building2 size={16} aria-hidden /> New client</button>}
      footer={(close) => (
        <>
          <button type="button" className={`${s.btn} ${s.btnGhost} ${s.btnSm}`} onClick={close}>Cancel</button>
          <button type="submit" form="new-client-form" className={`${s.btn} ${s.btnPrimary}`}>Create client</button>
        </>
      )}
    >
      <form id="new-client-form" action={newClientAction} style={{ display: "grid", gap: 14 }}>
        <label className={s.field}>Company name<input className={s.input} name="name" required autoFocus placeholder="Acme Compute Ltd" /></label>
        <label className={s.field}>Website (optional)<input className={s.input} name="website" type="url" placeholder="https://" /></label>
        <label className={s.field}>Internal notes (optional)<textarea className={s.input} name="notes" rows={3} placeholder="How they found PODOS, who introduced them, what they need…" /></label>
      </form>
    </Drawer>
  );
}
