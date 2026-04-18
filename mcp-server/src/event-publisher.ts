import { randomUUID } from 'crypto';
import { Event, StepEvent, StartWorkflowInput } from '@dashi/schema';
import { IngestionApiClient } from './ingestion-api-client';

export class EventPublisher {
  constructor(private readonly client: IngestionApiClient) {}

  async publish(args: StepEvent | StartWorkflowInput, successMessage: string) {
    let event: Event;
    switch (args.type) {
      case 'step_started':
      case 'step_completed':
        event = args;
        break;
      case 'workflow_started':
        event = { eventId: randomUUID(), ...args };
        break;
    }

    try {
      await this.client.publishEvent(event);
      return { content: [{ type: 'text' as const, text: successMessage }] };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { content: [{ type: 'text' as const, text: message }], isError: true };
    }
  }
}
