export function parseSpecDocument(doc: unknown): Record<string, unknown> {
  if (!doc || typeof doc !== 'object') throw new Error('spec must be an object');
  return doc as Record<string, unknown>;
}
