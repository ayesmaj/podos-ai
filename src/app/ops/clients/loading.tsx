import { AppShell, ops as s } from "@/components/ops/ui";
import { HeaderSkel, Kpis, PanelSkel, RowSkel, ToolbarSkel } from "../loading";

/** /ops/clients loading — 5 KPI, toolbar + 6 rows / rail. */
export default function Loading() {
  return (
    <AppShell active="/ops/clients">
      <HeaderSkel />
      <Kpis n={5} />
      <div className={s.split84}>
        <div className={s.stack}>
          <ToolbarSkel />
          <div className={s.rows}>{Array.from({ length: 6 }, (_, i) => <RowSkel key={i} />)}</div>
        </div>
        <aside className={s.rail}><PanelSkel tight /><PanelSkel tight /></aside>
      </div>
    </AppShell>
  );
}
