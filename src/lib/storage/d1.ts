import type { RunPhase, RunStatus } from '../types';

export async function createRun(db: D1Database, id: string, label: string): Promise<void> {
  await db.prepare(`INSERT INTO runs (id, label, status, phase, created_at, generation_readiness) VALUES (?, ?, 'queued', 'QUEUED', datetime('now'), 'NOT_READY')`).bind(id, label).run();
}

export async function updateRunPhase(db: D1Database, id: string, phase: RunPhase, status: RunStatus): Promise<void> {
  await db.prepare('UPDATE runs SET phase = ?, status = ? WHERE id = ?').bind(phase, status, id).run();
}

export async function listRuns(db: D1Database) {
  const result = await db.prepare('SELECT * FROM runs ORDER BY created_at DESC').all();
  return result.results;
}

export async function getRun(db: D1Database, id: string) {
  const result = await db.prepare('SELECT * FROM runs WHERE id = ?').bind(id).first();
  return result;
}

export async function appendEvent(db: D1Database, runId: string, phase: string, level: string, message: string): Promise<void> {
  await db.prepare("INSERT INTO run_events (id, run_id, timestamp, level, phase, message) VALUES (lower(hex(randomblob(16))), ?, datetime('now'), ?, ?, ?)")
    .bind(runId, level, phase, message)
    .run();
}
