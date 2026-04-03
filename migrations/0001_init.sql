CREATE TABLE IF NOT EXISTS runs (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  status TEXT NOT NULL,
  phase TEXT NOT NULL,
  created_at TEXT NOT NULL,
  started_at TEXT,
  finished_at TEXT,
  total_operations INTEGER DEFAULT 0,
  completed_operations INTEGER DEFAULT 0,
  passed_operations INTEGER DEFAULT 0,
  failed_operations INTEGER DEFAULT 0,
  skipped_operations INTEGER DEFAULT 0,
  blocked_operations INTEGER DEFAULT 0,
  fixture_required_operations INTEGER DEFAULT 0,
  static_only_operations INTEGER DEFAULT 0,
  manual_spec_score INTEGER,
  production_openapi3_score INTEGER,
  live_verified_coverage_score INTEGER,
  generation_readiness TEXT,
  summary_report_r2_key TEXT,
  error_message TEXT
);

CREATE TABLE IF NOT EXISTS run_events (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  level TEXT NOT NULL,
  phase TEXT NOT NULL,
  message TEXT NOT NULL,
  FOREIGN KEY(run_id) REFERENCES runs(id)
);

CREATE TABLE IF NOT EXISTS scenarios (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  started_at TEXT,
  finished_at TEXT,
  FOREIGN KEY(run_id) REFERENCES runs(id)
);

CREATE TABLE IF NOT EXISTS scenario_steps (
  id TEXT PRIMARY KEY,
  scenario_id TEXT NOT NULL,
  step_key TEXT NOT NULL,
  method TEXT NOT NULL,
  path TEXT NOT NULL,
  operation_id TEXT NOT NULL,
  execution_mode TEXT NOT NULL,
  status TEXT NOT NULL,
  dependency_status TEXT,
  endpoint_score INTEGER,
  openapi3_compatibility_score INTEGER,
  generation_readiness TEXT,
  issue_count INTEGER DEFAULT 0,
  issue_markdown_r2_key TEXT,
  request_artifact_r2_key TEXT,
  response_artifact_r2_key TEXT,
  diff_artifact_r2_key TEXT,
  FOREIGN KEY(scenario_id) REFERENCES scenarios(id)
);

CREATE TABLE IF NOT EXISTS step_issues (
  id TEXT PRIMARY KEY,
  scenario_step_id TEXT NOT NULL,
  code TEXT NOT NULL,
  severity TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  likely_source TEXT NOT NULL,
  blocking_for_generation INTEGER NOT NULL,
  FOREIGN KEY(scenario_step_id) REFERENCES scenario_steps(id)
);
