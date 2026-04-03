# Agentic OpenAPI Contract Validation Platform

## Design Blueprint (before implementation)

### 1) Concise architecture summary
- **Worker API + UI host (Hono)** serves dashboard routes and REST APIs for run lifecycle, reports, and CSV export.
- **Workflow layer** advances lifecycle phases (`Queued` → `Reports & Export`) and persists progress.
- **Queue layer** executes scenario steps with retry isolation and status updates.
- **AI planner layer** proposes dependency-aware candidate scenarios.
- **Deterministic validation layer** performs static and live contract checks and scoring.
- **Persistence layer** uses D1 for structured metadata and R2 for artifacts/reports.

### 2) D1 schema proposal
See `migrations/0001_init.sql` for `runs`, `run_events`, `scenarios`, `scenario_steps`, `step_issues`.

### 3) R2 key strategy
- `runs/{runId}/summary/run-summary.md`
- `runs/{runId}/issues/{stepKey}.md`
- `runs/{runId}/artifacts/{stepKey}_request.json`
- `runs/{runId}/artifacts/{stepKey}_response.json`
- `runs/{runId}/exports/run-{runId}.csv`

### 4) Planner output contract
Normalized with Zod in `src/lib/agent/plannerTypes.ts`, with endpoint-level scenario candidates, dependency bindings, confidence, and execution classification.

### 5) Scenario configuration format
Each scenario has `name`, `orderIndex`, ordered `steps`, optional `dependsOn`, bindings, and extraction rules.

### 6) Workflow lifecycle
`QUEUED` → `FETCH_SPEC` → `PARSE_VALIDATE` → `AI_SCENARIO_PLANNING` → `WORKFLOW_ORCHESTRATION` → `QUEUE_EXECUTION` → `SCORING_DRIFT_ANALYSIS` → `REPORTS_EXPORT` → `COMPLETED|FAILED`.

### 7) Queue usage plan
Workflow fan-outs scenario steps to `EXECUTION_QUEUE`; queue consumers ack and persist per-step outcome.

### 8) UI page map
- Runs list
- Run details
- Lifecycle rail
- Scenario panel
- Issues panel
- Activity feed
- AI planner panel
- Export center

### 9) API route map
Implemented in `src/worker/routes.ts`:
- `POST /api/runs`
- `GET /api/runs`
- `GET /api/runs/:id`
- `GET /api/runs/:id/progress`
- `GET /api/runs/:id/results`
- `GET /api/runs/:id/report`
- `GET /api/runs/:id/issues/:issueKey`
- `GET /api/runs/:id/export.csv`

### 10) Scoring model
- Manual Spec Trust = static issue penalties.
- Production OpenAPI 3 score = averaged compatibility scores.
- Live verified coverage = pass ratio on live-eligible operations.
- Generation readiness = `READY`, `READY_WITH_FIXES`, or `NOT_READY` using blocking/failure gates.

## What this app does
This app orchestrates OpenAPI validation runs with an AI planner for scenario proposal and a deterministic engine for contract validation against production responses.

## AI planner vs deterministic validator
- **AI planner**: scenario/dependency proposal only.
- **Deterministic validator**: status/content-type/schema checks, issue classification, and scoring.

## Cloudflare-native architecture
- Workers + Hono API
- Workflows orchestration
- Queues step execution
- D1 run state persistence
- R2 reports and artifacts

## Remote spec POST fetch
`src/lib/spec/fetchSpec.ts` supports:
- POST-only fetching
- API key header injection from server-side secrets
- configurable request body/headers
- optional `responsePath`
- JSON object spec, nested payload extraction, and YAML-string parsing.

## Scenarios and runs
- Scenario model in `src/lib/types/index.ts`
- Scenario creation in `src/lib/scenarios/loadScenarios.ts`
- Orchestration in `src/lib/orchestrator/runScenario.ts` with blocked dependency propagation.

## Scores and readiness
Scoring logic in `src/lib/validation/scoreStep.ts` and `src/lib/validation/scoreRun.ts`.

## Security notes
- Secrets are server-only environment bindings.
- Sanitization helpers redact sensitive values before logs/artifact writes.
- R2 key sanitization prevents unsafe key forms.

## Limitations (V1)
- Planner call currently uses a deterministic fallback stub; wire to model provider in production.
- Queue consumer currently acknowledges messages and needs full HTTP-execution runtime wiring.
- Dashboard sample component is intentionally compact and should be expanded in product deployment.

## Setup
1. Install deps: `npm install`
2. Apply D1 migration through Wrangler.
3. Configure secrets: `SPEC_FETCH_URL`, `SPEC_FETCH_API_KEY`, `TARGET_BASE_URL`.
4. Deploy worker with `wrangler deploy`.

