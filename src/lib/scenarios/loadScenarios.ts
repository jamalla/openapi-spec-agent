import type { PlannerOutput } from '../agent/plannerTypes';
import type { EnumeratedOperation } from '../spec/enumerateOperations';
import type { ScenarioDefinition } from '../types';

export function loadScenarios(ops: EnumeratedOperation[], plan: PlannerOutput): ScenarioDefinition[] {
  return ops.map((op, idx) => {
    const endpointPlan = plan.endpoints.find((e) => e.endpoint === `${op.method} ${op.path}`);
    return {
      name: endpointPlan?.candidateScenarios[0]?.name || `${op.operationId}_scenario`,
      orderIndex: idx,
      steps: [{
        stepKey: op.operationId,
        method: op.method,
        path: op.path,
        operationId: op.operationId,
        executionMode: endpointPlan?.classification || 'LIVE_SCHEMA_CHECK',
      }],
    };
  });
}
