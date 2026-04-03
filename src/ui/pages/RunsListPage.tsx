import type { SavedRun } from '../types/dashboard';

export function RunsListPage({ runs }: { runs: SavedRun[] }) {
  return (
    <aside className="sidebar panel">
      <h3>Saved runs</h3>
      <p className="muted">Every execution remains persisted for audit and compliance.</p>
      <div className="search-row">
        <input placeholder="Search runs" />
        <button className="icon-btn">⌕</button>
      </div>
      <div className="runs-list">
        {runs.map((run) => (
          <article key={run.id} className={`run-card ${run.status}`}>
            <header>
              <strong>{run.name}</strong>
              <span className={`chip ${run.status}`}>{run.status}</span>
            </header>
            <div className="muted tiny">{run.id}</div>
            <div className="tiny">{run.timestamp}</div>
            <div className="progress-track"><div style={{ width: `${run.progress}%` }} /></div>
            <footer className="tiny"><span>{run.note}</span><span>{run.progress}%</span></footer>
          </article>
        ))}
      </div>
    </aside>
  );
}
