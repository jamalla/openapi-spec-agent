export interface QueueMessage {
  runId: string;
  scenarioId: string;
}

export async function handleQueueBatch(batch: MessageBatch<QueueMessage>): Promise<void> {
  for (const msg of batch.messages) {
    msg.ack();
  }
}
