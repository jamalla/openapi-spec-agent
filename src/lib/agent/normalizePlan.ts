import { plannerOutputSchema, type PlannerOutput } from './plannerTypes';

export function normalizePlannerOutput(raw: unknown): PlannerOutput {
  return plannerOutputSchema.parse(raw);
}
