import { z } from 'zod';

export const plannerEndpointPlanSchema = z.object({
  endpoint: z.string(),
  candidateScenarios: z.array(z.object({
    name: z.string(),
    description: z.string(),
    risk: z.enum(['read', 'mutating', 'unsafe']),
    requiresFixture: z.boolean(),
  })).min(1).max(5),
  dependencies: z.array(z.object({
    from: z.string(),
    extract: z.string(),
    bindTo: z.string(),
  })),
  confidence: z.number().min(0).max(1),
  classification: z.enum([
    'STATIC_ONLY',
    'LIVE_SCHEMA_CHECK',
    'LIVE_SCHEMA_CHECK_WITH_DEPENDENCIES',
    'LIVE_SCHEMA_CHECK_WITH_FIXTURE',
    'SKIPPED_UNSAFE',
    'BLOCKED_BY_DEPENDENCY',
    'FIXTURE_REQUIRED',
  ]),
  extractionHints: z.array(z.string()).default([]),
  bindingHints: z.array(z.string()).default([]),
});

export const plannerOutputSchema = z.object({
  endpoints: z.array(plannerEndpointPlanSchema),
  globalNotes: z.array(z.string()).default([]),
});

export type PlannerOutput = z.infer<typeof plannerOutputSchema>;
