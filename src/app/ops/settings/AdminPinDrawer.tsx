"use client";

import { KeyRound } from "lucide-react";
import Drawer from "@/components/ops/ui/Drawer";
import s from "@/components/ops/ui/ops.module.css";
import { setAdminPinAction } from "./actions";

/** "Change code…" drawer: posts pin + pin_again to setAdminPinAction, then closes; the result toast is rendered by AdminResult. */
export default function AdminPinDrawer() {
  return (
    <Drawer
      title="Change access code" subtitle="4–12 digits, 6 or more recommended. It applies to the next sign-in; open sessions keep running."
      trigger={(open) => <button type="button" className={`${s.btn} ${s.btnSecondary} ${s.btnSm}`} onClick={open}><KeyRound size={15} aria-hidden /> Change code…</button>}
      footer={(close) => (
        <>
          <button type="button" className={`${s.btn} ${s.btnGhost} ${s.btnSm}`} onClick={close}>Cancel</button>
          <button type="submit" form="admin-pin-form" className={`${s.btn} ${s.btnPrimary}`}>Change access code</button>
        </>
      )}
    >
      {(close) => (
        <form id="admin-pin-form" action={async (fd) => { await setAdminPinAction(fd); close(); }} style={{ display: "grid", gap: 14 }}>
          <label className={s.field}>New access code<input className={s.input} name="pin" type="password" inputMode="numeric" pattern="[0-9]{4,12}" required autoComplete="off" autoFocus placeholder="••••••" /></label>
          <label className={s.field}>Repeat the code<input className={s.input} name="pin_again" type="password" inputMode="numeric" pattern="[0-9]{4,12}" required autoComplete="off" placeholder="••••••" /></label>
        </form>
      )}
    </Drawer>
  );
}
