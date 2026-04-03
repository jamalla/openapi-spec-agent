import { app } from './routes';
import { handleQueueBatch } from '../lib/queue/consumers';

export default {
  fetch: app.fetch,
  async queue(batch: MessageBatch<{ runId: string; scenarioId: string }>) {
    await handleQueueBatch(batch);
  },
};
