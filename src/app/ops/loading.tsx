import { AppShell, KpiGrid, Skeleton, ops as s } from "@/components/ops/ui";
import l from "./loading.module.css";

/**
 * /ops loading state — skeletons matching the dashboard geometry
 * (OPS_PAGE_ARCHETYPES §0/§1). The helpers are shared by the child routes'
 * loading.tsx files; none of them touch data, so AppShell is safe here.
 */

export function KpiSkel() {
  return (
    <div className={s.kpi} aria-hidden>
      <Skeleton h={44} w={44} />
      <div style={{ display: "grid", gap: 8, alignContent: "start" }}>
        <Skeleton h={12} w={80} />
        <Skeleton h={34} w={140} />
        <Skeleton h={12} w={120} />
      </div>
    </div>
  );
}
export function RowSkel() {
  return (
    <div className={`${s.row} ${l.rowSkel}`} aria-hidden>
      <Skeleton h={44} w={44} />
      <div style={{ display: "grid", gap: 8 }}>
        <Skeleton h={14} w="min(220px, 100%)" />
        <Skeleton h={12} w="min(160px, 100%)" />
      </div>
      <Skeleton h={24} w={100} />
      <Skeleton h={14} w={120} />
    </div>
  );
}
export function PanelSkel({ lines = 3, rows = 0, tight }: { lines?: number; rows?: number; tight?: boolean }) {
  return (
    <section className={`${s.panel}${tight ? ` ${s.panelTight}` : ""}`} aria-hidden>
      <Skeleton h={20} w={180} />
      <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
        {Array.from({ length: lines }, (_, i) => <Skeleton key={i} h={12} w={`${88 - i * 14}%`} />)}
      </div>
      {rows > 0 && <div className={s.rows} style={{ marginTop: 18 }}>{Array.from({ length: rows }, (_, i) => <RowSkel key={i} />)}</div>}
    </section>
  );
}
export function ToolbarSkel() {
  return (
    <div className={s.toolbar} aria-hidden>
      <Skeleton h={40} w="min(320px, 100%)" />
      <Skeleton h={36} w={72} /><Skeleton h={36} w={88} /><Skeleton h={36} w={80} />
    </div>
  );
}
export function HeaderSkel() {
  return (
    <header className={`${s.pageHeader} ${l.canvasSkel}`} aria-hidden>
      <div style={{ display: "grid", gap: 10 }}>
        <Skeleton h={36} w={280} />
        <Skeleton h={14} w="min(520px, 80vw)" />
      </div>
      <Skeleton h={44} w={150} />
    </header>
  );
}
export function Kpis({ n }: { n: number }) {
  return <KpiGrid>{Array.from({ length: n }, (_, i) => <KpiSkel key={i} />)}</KpiGrid>;
}

export default function Loading() {
  return (
    <AppShell active="/ops">
      <HeaderSkel />
      <Kpis n={6} />
      <PanelSkel lines={2} tight />
      <div className={s.split84}>
        <div className={s.stack}>
          <PanelSkel lines={1} rows={4} />
          <PanelSkel lines={4} />
        </div>
        <aside className={s.rail}>
          <PanelSkel tight /><PanelSkel tight /><PanelSkel tight />
        </aside>
      </div>
    </AppShell>
  );
}
