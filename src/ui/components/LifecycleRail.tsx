import type { LifecycleStage } from '../types/dashboard';

export function LifecycleRail({ stages }: { stages: LifecycleStage[] }) {
  return (
    <section className="panel">
      <h3>Run lifecycle</h3>
      <p className="muted">Full pipeline from spec fetch to reports and CSV export.</p>
      <div className="lifecycle-grid">
        {stages.map((stage) => (
          <div key={stage.name} className={`lifecycle-card ${stage.status.toLowerCase().replace(' ', '-')}`}>
            <div className="stage-name">{stage.name}</div>
            <div className="stage-status">{stage.status}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
