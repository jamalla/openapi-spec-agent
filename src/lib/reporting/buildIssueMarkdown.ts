import type { ValidationIssue } from '../validation/compareResponse';

export function buildIssueMarkdown(stepKey: string, issues: ValidationIssue[]): string {
  const lines = [`# Issue report: ${stepKey}`, '', '| Code | Severity | Message |', '|---|---|---|'];
  for (const issue of issues) lines.push(`| ${issue.code} | ${issue.severity} | ${issue.message} |`);
  return lines.join('\n');
}
