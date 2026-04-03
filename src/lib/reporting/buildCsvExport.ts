export interface CsvRow {
  run_id: string;
  scenario: string;
  step_key: string;
  method: string;
  path: string;
  operation_id: string;
  execution_mode: string;
  status: string;
  severity: string;
  endpoint_score: number;
  openapi3_compatibility_score: number;
  generation_readiness: string;
  issue_count: number;
  likely_source: string;
  issue_codes: string;
  issue_report_r2_key: string;
}

export function buildCsvExport(rows: CsvRow[]): string {
  const header = Object.keys(rows[0] || {
    run_id: '', scenario: '', step_key: '', method: '', path: '', operation_id: '', execution_mode: '', status: '', severity: '', endpoint_score: '', openapi3_compatibility_score: '', generation_readiness: '', issue_count: '', likely_source: '', issue_codes: '', issue_report_r2_key: '',
  });
  const escape = (v: unknown) => `"${String(v ?? '').replaceAll('"', '""')}"`;
  return [header.join(','), ...rows.map((r) => header.map((h) => escape((r as Record<string, unknown>)[h])).join(','))].join('\n');
}
