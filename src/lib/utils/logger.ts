import { sanitizeValue } from './sanitize';

export function logInfo(message: string, context?: unknown): void {
  console.log(message, context ? JSON.stringify(sanitizeValue(context)) : '');
}

export function logError(message: string, context?: unknown): void {
  console.error(message, context ? JSON.stringify(sanitizeValue(context)) : '');
}
