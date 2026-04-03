export interface Env {
  DB: D1Database;
  ARTIFACTS: R2Bucket;
  EXECUTION_QUEUE: Queue;
  VALIDATION_WORKFLOW: Workflow;
  SPEC_FETCH_URL: string;
  SPEC_FETCH_API_KEY: string;
  SPEC_FETCH_API_KEY_HEADER?: string;
  PLANNER_MODEL?: string;
  TARGET_BASE_URL: string;
}

export function secretHeader(env: Env): Record<string, string> {
  const key = env.SPEC_FETCH_API_KEY_HEADER || 'x-api-key';
  return { [key]: env.SPEC_FETCH_API_KEY };
}
