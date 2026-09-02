import { AppShell, ops as s } from "@/components/ops/ui";
import { HeaderSkel, Kpis, RowSkel, ToolbarSkel } from "../loading";

/** /ops/projects loading — 4 KPI, toolbar + 6 rows (12-col list archetype). */
export default function Loading() {
  return (
    <AppShell active="/ops/projects">
      <HeaderSkel />
      <Kpis n={4} />
      <ToolbarSkel />
      <div className={s.rows}>{Array.from({ length: 6 }, (_, i) => <RowSkel key={i} />)}</div>
    </AppShell>
  );
}
