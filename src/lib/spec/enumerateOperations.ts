export interface EnumeratedOperation {
  method: string;
  path: string;
  operationId: string;
  tags: string[];
}

export function enumerateOperations(doc: Record<string, any>): EnumeratedOperation[] {
  const ops: EnumeratedOperation[] = [];
  for (const [path, methods] of Object.entries(doc.paths || {})) {
    for (const [method, operation] of Object.entries(methods as Record<string, any>)) {
      if (!['get', 'post', 'put', 'patch', 'delete'].includes(method)) continue;
      ops.push({
        method: method.toUpperCase(),
        path,
        operationId: operation.operationId || `${method}_${path.replace(/[^a-zA-Z0-9]/g, '_')}`,
        tags: operation.tags || [],
      });
    }
  }
  return ops;
}
