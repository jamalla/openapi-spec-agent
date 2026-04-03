import type { ValidationIssue } from './compareResponse';

export function blocksGeneration(issue: ValidationIssue): boolean {
  return issue.severity === 'CRITICAL' || issue.severity === 'HIGH';
}
