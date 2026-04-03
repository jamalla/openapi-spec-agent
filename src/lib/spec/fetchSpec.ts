import YAML from 'js-yaml';
import type { Env } from '../config';
import { secretHeader } from '../config';

export interface SpecFetchConfig {
  url?: string;
  headers?: Record<string, string>;
  body?: unknown;
  responsePath?: string;
}

function getByPath(payload: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[part];
    return undefined;
  }, payload);
}

export async function fetchRemoteSpec(env: Env, cfg: SpecFetchConfig): Promise<Record<string, unknown>> {
  const response = await fetch(cfg.url || env.SPEC_FETCH_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...secretHeader(env),
      ...(cfg.headers || {}),
    },
    body: JSON.stringify(cfg.body || {}),
  });

  if (!response.ok) {
    throw new Error(`spec fetch failed with status ${response.status}`);
  }

  const rawText = await response.text();
  let payload: unknown;
  try {
    payload = JSON.parse(rawText);
  } catch {
    payload = rawText;
  }

  const extracted = cfg.responsePath ? getByPath(payload, cfg.responsePath) : payload;
  const candidate = extracted ?? payload;

  if (typeof candidate === 'string') {
    const maybeYaml = YAML.load(candidate);
    if (maybeYaml && typeof maybeYaml === 'object') return maybeYaml as Record<string, unknown>;
  }

  if (!candidate || typeof candidate !== 'object') {
    throw new Error('spec payload could not be resolved');
  }

  return candidate as Record<string, unknown>;
}
