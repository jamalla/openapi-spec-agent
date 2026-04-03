import { RunsListPage } from './pages/RunsListPage';
import { RunDetailsPage } from './pages/RunDetailsPage';
import { savedRuns } from './data/mock';
import './styles.css';

export function App() {
  return (
    <main className="app-shell">
      <header className="top-header">
        <div>
          <p className="muted">OpenAPI Contract Certification Platform</p>
          <h1>Lifecycle dashboard</h1>
          <p className="muted">Live view of spec fetch, AI scenario planning, workflow orchestration, queue execution, schema validation, scoring, and final generation readiness.</p>
        </div>
        <div className="actions">
          <button className="primary">New run</button>
          <button>Refresh</button>
          <button>Export CSV</button>
        </div>
      </header>

      <section className="metric-grid">
        <Metric title="Manual spec trust" value="74/100" subtitle="Schema quality and contract coherence" />
        <Metric title="OpenAPI 3 compatibility" value="81/100" subtitle="How contract-friendly production behavior is" />
        <Metric title="Live verified coverage" value="52/100" subtitle="Portion actually validated with real execution" />
        <Metric title="Generation readiness" value="READY_WITH_FIXES" subtitle="SDK, MCP, and agent generation decision" />
      </section>

      <section className="dashboard-grid">
        <RunsListPage runs={savedRuns} />
        <RunDetailsPage />
      </section>
    </main>
  );
}

function Metric({ title, value, subtitle }: { title: string; value: string; subtitle: string }) {
  return <article className="metric panel"><h4>{title}</h4><strong>{value}</strong><p className="muted tiny">{subtitle}</p></article>;
}
