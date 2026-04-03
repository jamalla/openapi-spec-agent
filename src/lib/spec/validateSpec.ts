import SwaggerParser from '@apidevtools/swagger-parser';

export interface StaticValidationIssue {
  code: string;
  message: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
}

export async function validateSpec(doc: Record<string, unknown>): Promise<StaticValidationIssue[]> {
  const issues: StaticValidationIssue[] = [];
  try {
    await SwaggerParser.validate(doc as object);
  } catch (err) {
    issues.push({ code: 'invalid_openapi_structure', message: (err as Error).message, severity: 'HIGH' });
  }

  const operationIds = new Set<string>();
  const duplicates = new Set<string>();
  const paths = (doc.paths || {}) as Record<string, Record<string, any>>;
  for (const methods of Object.values(paths)) {
    for (const op of Object.values(methods || {})) {
      const operationId = op?.operationId;
      if (!operationId) continue;
      if (operationIds.has(operationId)) duplicates.add(operationId);
      operationIds.add(operationId);
    }
  }

  for (const opId of duplicates) {
    issues.push({ code: 'duplicate_operation_id', message: `duplicate operationId: ${opId}`, severity: 'MEDIUM' });
  }
  return issues;
}
