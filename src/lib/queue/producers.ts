export async function enqueueScenario(queue: Queue, payload: unknown): Promise<void> {
  await queue.send(payload);
}
