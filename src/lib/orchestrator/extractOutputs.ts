export function extractByPath(payload: unknown, path: string): unknown {
  const clean = path.replace(/^\$\./, '');
  return clean.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, payload);
}
