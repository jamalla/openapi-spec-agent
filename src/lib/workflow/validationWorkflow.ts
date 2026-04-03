import type { Env } from '../config';
import { fetchRemoteSpec } from '../spec/fetchSpec';
import { parseSpecDocument } from '../spec/parseSpec';
import { validateSpec } from '../spec/validateSpec';
import { enumerateOperations } from '../spec/enumerateOperations';
import { planScenariosWithAI } from '../agent/planScenarios';
import { normalizePlannerOutput } from '../agent/normalizePlan';
import { loadScenarios } from '../scenarios/loadScenarios';

export async function runValidationWorkflow(env: Env, runId: string): Promise<{ runId: string; operations: number; scenarios: number; staticIssues: number }> {
  const specRaw = await fetchRemoteSpec(env, {});
  const spec = parseSpecDocument(specRaw);
  const staticIssues = await validateSpec(spec);
  const operations = enumerateOperations(spec);
  const rawPlan = await planScenariosWithAI(operations);
  const plan = normalizePlannerOutput(rawPlan);
  const scenarios = loadScenarios(operations, plan);

  return {
    runId,
    operations: operations.length,
    scenarios: scenarios.length,
    staticIssues: staticIssues.length,
  };
}
