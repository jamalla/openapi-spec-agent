export type RunStatus = 'queued' | 'running' | 'completed' | 'failed';

export type RunPhase =
  | 'QUEUED'
  | 'FETCH_SPEC'
  | 'PARSE_VALIDATE'
  | 'AI_SCENARIO_PLANNING'
  | 'WORKFLOW_ORCHESTRATION'
  | 'QUEUE_EXECUTION'
  | 'SCORING_DRIFT_ANALYSIS'
  | 'REPORTS_EXPORT'
  | 'COMPLETED'
  | 'FAILED';

export type ExecutionMode =
  | 'STATIC_ONLY'
  | 'LIVE_SCHEMA_CHECK'
  | 'LIVE_SCHEMA_CHECK_WITH_DEPENDENCIES'
  | 'LIVE_SCHEMA_CHECK_WITH_FIXTURE'
  | 'SKIPPED_UNSAFE'
  | 'BLOCKED_BY_DEPENDENCY'
  | 'FIXTURE_REQUIRED';

export type StepStatus =
  | 'PENDING'
  | 'RUNNING'
  | 'PASSED'
  | 'FAILED'
  | 'BLOCKED_BY_DEPENDENCY'
  | 'SKIPPED_UNSAFE'
  | 'FIXTURE_REQUIRED';

export type IssueSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
export type LikelySource = 'likely_spec_issue' | 'likely_production_issue' | 'ambiguous' | 'insufficient_evidence';

export interface RunRecord {
  id: string;
  label: string;
  status: RunStatus;
  phase: RunPhase;
  generation_readiness: 'READY' | 'READY_WITH_FIXES' | 'NOT_READY';
  created_at: string;
}

export interface PlannerDependency {
  from: string;
  extract: string;
  bindTo: string;
}

export interface CandidateScenario {
  name: string;
  description: string;
  risk: 'read' | 'mutating' | 'unsafe';
  requiresFixture: boolean;
}

export interface PlannerEndpointPlan {
  endpoint: string;
  candidateScenarios: CandidateScenario[];
  dependencies: PlannerDependency[];
  confidence: number;
  classification: ExecutionMode;
  extractionHints: string[];
  bindingHints: string[];
}

export interface ScenarioStep {
  stepKey: string;
  method: string;
  path: string;
  operationId: string;
  executionMode: ExecutionMode;
  dependsOn?: string[];
  bindings?: Array<{ from: string; to: string }>;
  extractions?: Array<{ from: string; to: string }>;
}

export interface ScenarioDefinition {
  name: string;
  orderIndex: number;
  steps: ScenarioStep[];
}
