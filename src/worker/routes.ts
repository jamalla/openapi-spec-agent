import { Hono } from 'hono';
import type { Env } from '../lib/config';
import { createRun, getRun, listRuns } from '../lib/storage/d1';
import { getText } from '../lib/storage/r2';
import { buildCsvExport } from '../lib/reporting/buildCsvExport';

export const app = new Hono<{ Bindings: Env }>();

app.get('/api/health', (c) => c.json({ ok: true }));

app.post('/api/runs', async (c) => {
  const body = await c.req.json<{ label?: string }>();
  const id = crypto.randomUUID();
  await createRun(c.env.DB, id, body.label || `Run ${id.slice(0, 8)}`);
  return c.json({ id }, 201);
});

app.get('/api/runs', async (c) => c.json({ runs: await listRuns(c.env.DB) }));
app.get('/api/runs/:id', async (c) => c.json({ run: await getRun(c.env.DB, c.req.param('id')) }));
app.get('/api/runs/:id/progress', async (c) => c.json({ run: await getRun(c.env.DB, c.req.param('id')) }));
app.get('/api/runs/:id/results', async (c) => c.json({ run: await getRun(c.env.DB, c.req.param('id')) }));

app.get('/api/runs/:id/report', async (c) => {
  const run = await getRun(c.env.DB, c.req.param('id')) as { summary_report_r2_key?: string } | null;
  if (!run?.summary_report_r2_key) return c.text('report not found', 404);
  const md = await getText(c.env.ARTIFACTS, run.summary_report_r2_key);
  return c.text(md || 'report not found', md ? 200 : 404);
});

app.get('/api/runs/:id/issues/:issueKey', async (c) => {
  const text = await getText(c.env.ARTIFACTS, `runs/${c.req.param('id')}/issues/${c.req.param('issueKey')}.md`);
  return c.text(text || 'issue not found', text ? 200 : 404);
});

app.get('/api/runs/:id/export.csv', async (c) => {
  const csv = buildCsvExport([]);
  c.header('content-type', 'text/csv; charset=utf-8');
  c.header('content-disposition', `attachment; filename=run-${c.req.param('id')}.csv`);
  return c.body(csv);
});

app.get('*', (c) => c.html(`<!doctype html><html><body><h1>OpenAPI Contract Certification Platform</h1><p>Dashboard assets should be served from Workers Assets in production.</p></body></html>`));
