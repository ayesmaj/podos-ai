import type { ReactNode } from "react";
import { AppShell, PageHeader } from "@/components/ops/ui";

/**
 * OpsShell — compatibility wrapper: every existing /ops page renders through
 * the universal AppShell + PageHeader from the design system. New pages should
 * import AppShell/PageHeader directly for richer headers (subtitle, counts).
 */
export default function OpsShell({ active, title, subtitle, actions, children }: {
  active: string; title: string; subtitle?: string; actions?: ReactNode; children: ReactNode;
}) {
  return (
    <AppShell active={active}>
      <PageHeader title={title} subtitle={subtitle} actions={actions} />
      {children}
    </AppShell>
  );
}
