import type { ValidationIssue } from './compareResponse';

export function scoreStep(issues: ValidationIssue[]): { endpointScore: number; compatibilityScore: number } {
  const penalty = issues.reduce((acc, issue) => {
    const p = issue.severity === 'CRITICAL' ? 35 : issue.severity === 'HIGH' ? 20 : issue.severity === 'MEDIUM' ? 10 : issue.severity === 'LOW' ? 4 : 1;
    return acc + p;
  }, 0);
  const endpointScore = Math.max(0, 100 - penalty);
  const compatibilityScore = Math.max(0, endpointScore - (issues.some((i) => i.code === 'content_type_mismatch') ? 5 : 0));
  return { endpointScore, compatibilityScore };
}
