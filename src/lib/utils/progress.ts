import type { RunPhase } from '../types';

export const LIFECYCLE: RunPhase[] = [
  'QUEUED',
  'FETCH_SPEC',
  'PARSE_VALIDATE',
  'AI_SCENARIO_PLANNING',
  'WORKFLOW_ORCHESTRATION',
  'QUEUE_EXECUTION',
  'SCORING_DRIFT_ANALYSIS',
  'REPORTS_EXPORT',
  'COMPLETED',
];

export function phaseProgress(phase: RunPhase): number {
  const index = Math.max(0, LIFECYCLE.indexOf(phase));
  return Math.round((index / (LIFECYCLE.length - 1)) * 100);
}
