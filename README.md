# Agentic OpenAPI Contract Validation Platform

Cloudflare-native platform for AI-assisted endpoint planning plus deterministic OpenAPI contract validation with a live lifecycle dashboard.

## Architecture Summary
- **Worker API + UI host:** Hono routes create/list runs, serve progress/results/issues/report/CSV, and host dashboard assets.
- **Workflow orchestration:** long-running run lifecycle management across phases.
- **Queue execution:** asynchronous, dependency-aware step execution and isolation.
- **AI planning:** scenario/dependency proposal only.
- **Deterministic validation:** schema/status/content-type checks and scoring as source of truth.
- **Persistence:** D1 for relational state and R2 for reports/artifacts/exports.

## D1 Schema
Defined in `migrations/0001_init.sql`:
- `runs`
- `run_events`
- `scenarios`
- `scenario_steps`
- `step_issues`

## R2 Key Strategy
- `runs/{runId}/summary/run-summary.md`
- `runs/{runId}/issues/{stepKey}.md`
- `runs/{runId}/artifacts/{stepKey}_request.json`
- `runs/{runId}/artifacts/{stepKey}_response.json`
- `runs/{runId}/exports/run-{runId}.csv`

## Planner Output Contract
`src/lib/agent/plannerTypes.ts` defines normalized planner output with:
- endpoint id (`METHOD /path`)
- 3-5 candidate scenarios (supported schema allows 1-5)
- dependency extraction/binding hints
- confidence
- execution classification

## Scenario Configuration Format
Each scenario has:
- `name`, `orderIndex`
- ordered `steps`
- execution mode
- optional dependencies (`dependsOn`)
- optional binding/extraction hints

## Workflow Lifecycle
`QUEUED` → `FETCH_SPEC` → `PARSE_VALIDATE` → `AI_SCENARIO_PLANNING` → `WORKFLOW_ORCHESTRATION` → `QUEUE_EXECUTION` → `SCORING_DRIFT_ANALYSIS` → `REPORTS_EXPORT` → `COMPLETED|FAILED`

## Queue Usage Plan
Workflow fans out scenario tasks to `EXECUTION_QUEUE`; consumers process each step in isolation and ack messages.

## UI Map
Implemented React dashboard to match the provided lifecycle wireframe style:
- top KPI cards
- saved runs rail
- selected run progress and counters
- lifecycle rail
- tabs (Scenarios/Issues/Activity/AI planner)
- scenario orchestration cards with step chips and status

## API Routes
- `POST /api/runs`
- `GET /api/runs`
- `GET /api/runs/:id`
- `GET /api/runs/:id/progress`
- `GET /api/runs/:id/results`
- `GET /api/runs/:id/report`
- `GET /api/runs/:id/issues/:issueKey`
- `GET /api/runs/:id/export.csv`

## Scoring Model
- **Manual Spec Trustworthiness:** static issue penalties.
- **Production OpenAPI 3 Compatibility:** average compatibility score from validated steps.
- **Live Verified Coverage:** passed / live-eligible steps.
- **Generation Readiness:** `READY`, `READY_WITH_FIXES`, `NOT_READY`.

## Security
- API secrets remain server-side in environment bindings.
- payload/log sanitization redacts sensitive fields.
- never expose secret headers in UI or persisted reports.

## CI/CD Deployment
GitHub Actions workflow (`.github/workflows/ci-cd.yml`) provides:
1. CI on PR + main push (`npm ci`, lint, test, build)
2. CD on main push using `cloudflare/wrangler-action` with:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`

## Required Environment Variables / Bindings
- `SPEC_FETCH_URL`
- `SPEC_FETCH_API_KEY`
- `SPEC_FETCH_API_KEY_HEADER` (optional)
- `TARGET_BASE_URL`
- D1 binding `DB`
- R2 binding `ARTIFACTS`
- Queue binding `EXECUTION_QUEUE`

## Local Development
```bash
npm install
npm run dev
```

## Deploy
```bash
npm run build
wrangler deploy
```

## Limitations (V1)
- Planner currently uses deterministic fallback output; wire a model provider in production.
- Queue consumer and workflow runner are scaffolded and ready for full live execution integration.
- Dashboard currently uses mock data to mirror required operational view while backend execution is integrated.
