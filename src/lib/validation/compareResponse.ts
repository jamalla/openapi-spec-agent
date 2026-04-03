import type { IssueSeverity, LikelySource } from '../types';

export interface ValidationIssue {
  code: string;
  severity: IssueSeverity;
  title: string;
  message: string;
  likelySource: LikelySource;
}

export function compareResponse(expectedStatus: number[], actualStatus: number, expectedContentType: string | undefined, actualContentType: string | null): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!expectedStatus.includes(actualStatus)) {
    issues.push({
      code: 'undocumented_status_code',
      severity: 'HIGH',
      title: 'Undocumented status code',
      message: `Received ${actualStatus} but spec allows ${expectedStatus.join(',')}`,
      likelySource: 'likely_spec_issue',
    });
  }
  if (expectedContentType && actualContentType && !actualContentType.includes(expectedContentType)) {
    issues.push({
      code: 'content_type_mismatch',
      severity: 'MEDIUM',
      title: 'Content type mismatch',
      message: `Expected ${expectedContentType}, got ${actualContentType}`,
      likelySource: 'ambiguous',
    });
  }
  return issues;
}
