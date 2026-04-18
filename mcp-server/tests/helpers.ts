import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { Event, StartWorkflowInput } from '@dashi/schema';
import { IngestionApiClient } from '../src/ingestion-api-client';
import { createServer } from '../src/server';

export function makePublishEventInput(overrides: Partial<Event> = {}) {
  return {
    name: 'publish_event' as const,
    arguments: {
      eventId: 'step-1',
      workflowId: 'wf-abc',
      agentId: 'agent-xyz',
      type: 'step_started',
      timestamp: '2026-04-15T10:00:00.000Z',
      ...overrides,
    } as Event,
  };
}

export function makeStartWorkflowEventInput(overrides: Partial<StartWorkflowInput> = {}) {
  return {
    name: 'start_workflow' as const,
    arguments: {
      workflowId: 'wf-abc',
      agentId:    'agent-xyz',
      type:       'workflow_started' as const,
      timestamp:  '2026-04-15T10:00:00.000Z',
      payload:    { steps: ['step-1', 'step-2', 'step-3'] },
      ...overrides,
    } as StartWorkflowInput,
  };
}

export class InMemoryIngestionApiClient implements IngestionApiClient {
  readonly publishedEvents: Event[] = [];
  private shouldThrow: Error | null = null;

  failWith(error: Error): void {
    this.shouldThrow = error;
  }

  async publishEvent(event: Event): Promise<void> {
    if (this.shouldThrow) throw this.shouldThrow;
    this.publishedEvents.push(event);
  }
}

export async function createTestClient(apiClient: IngestionApiClient): Promise<Client> {
  const server = createServer(apiClient);
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: 'test-client', version: '1.0.0' });
  await server.connect(serverTransport);
  await client.connect(clientTransport);
  return client;
}
