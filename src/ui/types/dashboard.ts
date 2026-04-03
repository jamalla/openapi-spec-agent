export type RunChipStatus = 'running' | 'completed' | 'failed';

export interface SavedRun {
  id: string;
  name: string;
  status: RunChipStatus;
  timestamp: string;
  note: string;
  progress: number;
}

export interface LifecycleStage {
  name: string;
  status: 'Completed' | 'In progress' | 'Pending';
}

export interface ScenarioRow {
  name: string;
  status: 'running' | 'completed' | 'failed';
  progress: number;
  steps: Array<{ key: string; tone: 'safe' | 'neutral' | 'warn' | 'blocked' }>;
}
