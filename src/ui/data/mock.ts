import type { LifecycleStage, SavedRun, ScenarioRow } from '../types/dashboard';

export const savedRuns: SavedRun[] = [
  {
    id: 'RUN-2026-04-03-001',
    name: 'Nightly Production Certification',
    status: 'running',
    timestamp: '2026-04-03 09:14',
    note: 'Validating dependencies',
    progress: 61,
  },
  {
    id: 'RUN-2026-04-02-007',
    name: 'Catalog API Baseline',
    status: 'completed',
    timestamp: '2026-04-02 22:10',
    note: 'Completed',
    progress: 100,
  },
  {
    id: 'RUN-2026-04-02-004',
    name: 'Orders API Safety Sweep',
    status: 'failed',
    timestamp: '2026-04-02 14:31',
    note: 'Blocked by dependency failures',
    progress: 43,
  },
];

export const lifecycleStages: LifecycleStage[] = [
  { name: 'Queued', status: 'Completed' },
  { name: 'Fetch Spec', status: 'Completed' },
  { name: 'Parse / Validate', status: 'Completed' },
  { name: 'AI Scenario Planning', status: 'Completed' },
  { name: 'Workflow Orchestration', status: 'In progress' },
  { name: 'Queue Execution', status: 'In progress' },
  { name: 'Scoring & Drift Analysis', status: 'Pending' },
  { name: 'Reports & Export', status: 'Pending' },
];

export const scenarios: ScenarioRow[] = [
  {
    name: 'product_creation_flow',
    status: 'running',
    progress: 75,
    steps: [
      { key: 'list_categories', tone: 'safe' },
      { key: 'select_valid_category', tone: 'safe' },
      { key: 'create_product', tone: 'warn' },
      { key: 'get_product_by_id', tone: 'blocked' },
    ],
  },
  {
    name: 'order_lifecycle_flow',
    status: 'running',
    progress: 58,
    steps: [
      { key: 'list_products', tone: 'safe' },
      { key: 'create_cart', tone: 'neutral' },
      { key: 'create_order', tone: 'neutral' },
    ],
  },
];
