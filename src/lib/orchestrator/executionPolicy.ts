import type { ExecutionMode } from '../types';

export function isLiveMode(mode: ExecutionMode): boolean {
  return mode === 'LIVE_SCHEMA_CHECK' || mode === 'LIVE_SCHEMA_CHECK_WITH_DEPENDENCIES' || mode === 'LIVE_SCHEMA_CHECK_WITH_FIXTURE';
}
