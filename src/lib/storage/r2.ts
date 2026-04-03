import { sanitizeR2KeyPart } from '../utils/sanitize';

export async function putJson(bucket: R2Bucket, key: string, body: unknown): Promise<string> {
  const safeKey = sanitizeR2KeyPart(key);
  await bucket.put(safeKey, JSON.stringify(body, null, 2), { httpMetadata: { contentType: 'application/json' } });
  return safeKey;
}

export async function putMarkdown(bucket: R2Bucket, key: string, markdown: string): Promise<string> {
  const safeKey = sanitizeR2KeyPart(key);
  await bucket.put(safeKey, markdown, { httpMetadata: { contentType: 'text/markdown; charset=utf-8' } });
  return safeKey;
}

export async function getText(bucket: R2Bucket, key: string): Promise<string | null> {
  const obj = await bucket.get(key);
  return obj ? await obj.text() : null;
}
