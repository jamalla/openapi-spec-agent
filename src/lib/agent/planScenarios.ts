import type { EnumeratedOperation } from '../spec/enumerateOperations';
import type { PlannerOutput } from './plannerTypes';

export async function planScenariosWithAI(operations: EnumeratedOperation[]): Promise<PlannerOutput> {
  return {
    endpoints: operations.map((op) => ({
      endpoint: `${op.method} ${op.path}`,
      candidateScenarios: [{
        name: `${op.operationId}_baseline`,
        description: `Baseline ${op.method} ${op.path} validation`,
        risk: op.method === 'GET' ? 'read' : 'mutating',
        requiresFixture: op.method !== 'GET',
      }],
      dependencies: [],
      confidence: 0.65,
      classification: op.method === 'GET' ? 'LIVE_SCHEMA_CHECK' : 'LIVE_SCHEMA_CHECK_WITH_DEPENDENCIES',
      extractionHints: ['$.id'],
      bindingHints: ['request.path.id'],
    })),
    globalNotes: ['Fallback planner output used; integrate provider-specific model call in production.'],
  };
}
