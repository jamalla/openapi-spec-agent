import { LifecycleRail } from '../components/LifecycleRail';
import { lifecycleStages, scenarios } from '../data/mock';

const tabItems = ['Scenarios', 'Issues', 'Activity', 'AI planner'];

export function RunDetailsPage() {
  return (
    <div className="content">
      <section className="panel">
        <header className="run-header">
          <div>
            <h2>Nightly Production Certification</h2>
            <p className="muted">RUN-2026-04-03-001 · Validating dependencies</p>
          </div>
          <div className="header-chips">
            <span className="chip running">running</span>
            <span className="chip">READY_WITH_FIXES</span>
          </div>
        </header>
        <p>Run progress</p>
        <div className="progress-track big"><div style={{ width: '61%' }} /></div>
        <div className="counter-grid">
          <Counter label="Completed" value="194" />
          <Counter label="Passed" value="141" tone="safe" />
          <Counter label="Failed" value="27" tone="warn" />
          <Counter label="Blocked / Fixture" value="26" tone="blocked" />
        </div>
      </section>

      <LifecycleRail stages={lifecycleStages} />

      <nav className="tabs">
        {tabItems.map((tab, idx) => <button key={tab} className={idx === 0 ? 'active' : ''}>{tab}</button>)}
      </nav>

      <section className="panel">
        <h3>Scenario orchestration</h3>
        <p className="muted">Dependency-aware flows with context extraction and blocked-step propagation.</p>
        {scenarios.map((row) => (
          <article className="scenario-card" key={row.name}>
            <div className="scenario-header">
              <strong>{row.name}</strong>
              <span className="chip running">{row.status}</span>
            </div>
            <div className="step-row">
              {row.steps.map((step) => <span className={`step ${step.tone}`} key={step.key}>{step.key}</span>)}
            </div>
            <div className="scenario-progress">
              <div className="progress-track"><div style={{ width: `${row.progress}%` }} /></div>
              <span className="tiny">{row.progress}%</span>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

function Counter({ label, value, tone = 'neutral' }: { label: string; value: string; tone?: 'neutral' | 'safe' | 'warn' | 'blocked' }) {
  return <div className={`counter ${tone}`}><div className="tiny">{label}</div><strong>{value}</strong></div>;
}
