import type { ScenarioDefinition, StepStatus } from '../types';
import { isLiveMode } from './executionPolicy';

export interface StepExecutor {
  run(stepKey: string): Promise<{ ok: boolean }>;
}

export async function runScenario(def: ScenarioDefinition, executor: StepExecutor): Promise<Record<string, StepStatus>> {
  const status: Record<string, StepStatus> = {};
  for (const step of def.steps) {
    const deps = step.dependsOn || [];
    if (deps.some((d) => status[d] === 'FAILED' || status[d] === 'BLOCKED_BY_DEPENDENCY')) {
      status[step.stepKey] = 'BLOCKED_BY_DEPENDENCY';
      continue;
    }
    if (!isLiveMode(step.executionMode)) {
      status[step.stepKey] = step.executionMode as StepStatus;
      continue;
    }
    const result = await executor.run(step.stepKey);
    status[step.stepKey] = result.ok ? 'PASSED' : 'FAILED';
  }
  return status;
}
