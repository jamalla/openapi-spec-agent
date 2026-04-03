import { describe, expect, it } from 'vitest';
import { parseSpecDocument } from '../src/lib/spec/parseSpec';
import { extractByPath } from '../src/lib/orchestrator/extractOutputs';
import { normalizePlannerOutput } from '../src/lib/agent/normalizePlan';
import { loadScenarios } from '../src/lib/scenarios/loadScenarios';
import { bindRequest } from '../src/lib/orchestrator/bindContext';
import { runScenario } from '../src/lib/orchestrator/runScenario';
import { compareResponse } from '../src/lib/validation/compareResponse';
import { scoreStep } from '../src/lib/validation/scoreStep';
import { scoreRun } from '../src/lib/validation/scoreRun';
import { buildIssueMarkdown } from '../src/lib/reporting/buildIssueMarkdown';
import { buildCsvExport } from '../src/lib/reporting/buildCsvExport';
import { sanitizeR2KeyPart } from '../src/lib/utils/sanitize';

describe('core flow utilities', () => {
  it('parses spec object', () => {
    expect(parseSpecDocument({ openapi: '3.0.0' }).openapi).toBe('3.0.0');
  });

  it('extracts path values', () => {
    expect(extractByPath({ data: { id: 'abc' } }, '$.data.id')).toBe('abc');
  });

  it('normalizes planner output', () => {
    const out = normalizePlannerOutput({
      endpoints: [{
        endpoint: 'GET /products',
        candidateScenarios: [{ name: 's1', description: 'd', risk: 'read', requiresFixture: false }],
        dependencies: [], confidence: 0.8, classification: 'LIVE_SCHEMA_CHECK', extractionHints: [], bindingHints: [],
      }],
    });
    expect(out.endpoints[0].endpoint).toBe('GET /products');
  });

  it('loads scenarios', () => {
    const scenarios = loadScenarios([{ method: 'GET', path: '/p', operationId: 'getP', tags: [] }], {
      endpoints: [{ endpoint: 'GET /p', candidateScenarios: [{ name: 'basic', description: 'x', risk: 'read', requiresFixture: false }], dependencies: [], confidence: 0.6, classification: 'LIVE_SCHEMA_CHECK', extractionHints: [], bindingHints: [] }], globalNotes: [],
    });
    expect(scenarios[0].name).toBe('basic');
  });

  it('binds context', () => {
    const req = bindRequest({}, { id: 10 }, [{ from: 'id', to: 'request.body.id' }]);
    expect((req.body as Record<string, unknown>).id).toBe(10);
  });

  it('propagates blocked dependency', async () => {
    const result = await runScenario({
      name: 'flow', orderIndex: 0,
      steps: [
        { stepKey: 'a', method: 'GET', path: '/a', operationId: 'a', executionMode: 'LIVE_SCHEMA_CHECK' },
        { stepKey: 'b', method: 'GET', path: '/b', operationId: 'b', executionMode: 'LIVE_SCHEMA_CHECK', dependsOn: ['a'] },
      ],
    }, { run: async (k) => ({ ok: k !== 'a' }) });
    expect(result.b).toBe('BLOCKED_BY_DEPENDENCY');
  });

  it('compares response and scores', () => {
    const issues = compareResponse([200], 500, 'application/json', 'text/html');
    const score = scoreStep(issues);
    expect(issues.length).toBeGreaterThan(0);
    expect(score.endpointScore).toBeLessThan(100);
  });

  it('scores run', () => {
    const score = scoreRun({ total: 10, passed: 7, failed: 0, blocked: 0, fixtureRequired: 1, staticOnly: 1, manualSpecIssueCount: 1, avgCompatibility: 80 });
    expect(score.generationReadiness).toBe('READY_WITH_FIXES');
  });

  it('builds markdown and csv', () => {
    const md = buildIssueMarkdown('get_p', [{ code: 'x', severity: 'LOW', title: 't', message: 'm', likelySource: 'ambiguous' }]);
    const csv = buildCsvExport([{ run_id: '1', scenario: 's', step_key: 'k', method: 'GET', path: '/x', operation_id: 'op', execution_mode: 'LIVE_SCHEMA_CHECK', status: 'PASSED', severity: 'LOW', endpoint_score: 90, openapi3_compatibility_score: 89, generation_readiness: 'READY', issue_count: 0, likely_source: 'ambiguous', issue_codes: 'x', issue_report_r2_key: 'r2' }]);
    expect(md).toContain('Issue report');
    expect(csv).toContain('run_id');
  });

  it('sanitizes r2 key', () => {
    expect(sanitizeR2KeyPart('POST /Products')).toBe('post__products');
  });
});
