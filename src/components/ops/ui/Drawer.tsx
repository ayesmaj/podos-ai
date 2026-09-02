"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import s from "./ops.module.css";

/**
 * Drawer — right-side panel (bottom sheet on phones) opened by a trigger.
 * Closes on Escape and backdrop click. Content is rendered only while open so
 * forms reset each time. `footer` is rendered in the sticky drawer footer.
 */
export default function Drawer({ trigger, title, subtitle, children, footer, open: controlled, onOpenChange }: {
  trigger: (open: () => void) => ReactNode;
  title: string; subtitle?: string;
  children: ReactNode | ((close: () => void) => ReactNode);
  footer?: ReactNode | ((close: () => void) => ReactNode);
  open?: boolean; onOpenChange?: (open: boolean) => void;
}) {
  const [inner, setInner] = useState(false);
  const open = controlled ?? inner;
  const setOpen = (v: boolean) => { setInner(v); onOpenChange?.(v); };
  const id = useId();
  const panel = useRef<HTMLDivElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    // focus the first control inside; give focus back to the opener on close
    returnTo.current = document.activeElement as HTMLElement | null;
    const first = panel.current?.querySelector<HTMLElement>("input, select, textarea, button:not([aria-label='Close']), [href]");
    (first ?? panel.current)?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; returnTo.current?.focus?.(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const close = () => setOpen(false);
  return (
    <>
      {trigger(() => setOpen(true))}
      {open && (
        <>
          <div className={s.backdrop} onClick={close} aria-hidden />
          <div ref={panel} tabIndex={-1} className={s.drawer} role="dialog" aria-modal="true" aria-labelledby={id}>
            <div className={s.drawerHead}>
              <div><h2 id={id} className={s.drawerTitle}>{title}</h2>{subtitle && <p className={s.drawerSub}>{subtitle}</p>}</div>
              <button type="button" className={s.iconBtn} onClick={close} aria-label="Close"><X size={18} /></button>
            </div>
            <div className={s.drawerBody}>{typeof children === "function" ? children(close) : children}</div>
            {footer && <div className={s.drawerFoot}>{typeof footer === "function" ? footer(close) : footer}</div>}
          </div>
        </>
      )}
    </>
  );
}
