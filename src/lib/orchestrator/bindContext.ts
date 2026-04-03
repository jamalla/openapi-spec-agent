import { extractByPath } from './extractOutputs';

export function bindRequest(template: Record<string, unknown>, context: Record<string, unknown>, bindings: Array<{ from: string; to: string }> = []): Record<string, unknown> {
  const out = structuredClone(template);
  for (const b of bindings) {
    const value = extractByPath(context, b.from);
    if (value === undefined) continue;
    const path = b.to.replace(/^request\./, '').split('.');
    let cursor: Record<string, unknown> = out;
    while (path.length > 1) {
      const key = path.shift() as string;
      cursor[key] = (cursor[key] as Record<string, unknown>) || {};
      cursor = cursor[key] as Record<string, unknown>;
    }
    cursor[path[0]] = value;
  }
  return out;
}
