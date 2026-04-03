const SENSITIVE_KEYS = ['authorization', 'token', 'password', 'secret', 'apiKey', 'x-api-key'];

export function sanitizeValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = SENSITIVE_KEYS.some((needle) => k.toLowerCase().includes(needle.toLowerCase())) ? '[REDACTED]' : sanitizeValue(v);
    }
    return out;
  }
  return value;
}

export function sanitizeR2KeyPart(part: string): string {
  return part.toLowerCase().replace(/[^a-z0-9_/-]+/g, '_').replace(/^_+|_+$/g, '');
}
