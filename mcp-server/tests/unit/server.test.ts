import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryIngestionApiClient, createTestClient, makePublishEventInput, makeStartWorkflowEventInput } from '../helpers';

describe('server', () => {
  let apiClient: InMemoryIngestionApiClient;
  let mcpClient: Client;

  beforeEach(async () => {
    apiClient = new InMemoryIngestionApiClient();
    mcpClient = await createTestClient(apiClient);
  });

  test('publish_event forwards a valid event to the ingestion API', async () => {
    await mcpClient.callTool(makePublishEventInput());

    expect(apiClient.publishedEvents).toHaveLength(1);
  });

  test('start_workflow forwards a workflow_started event to the ingestion API', async () => {
    await mcpClient.callTool(makeStartWorkflowEventInput());

    expect(apiClient.publishedEvents).toHaveLength(1);
    expect(apiClient.publishedEvents[0]).toMatchObject({
      workflowId: 'wf-abc',
      type: 'workflow_started',
      payload: { steps: ['step-1', 'step-2', 'step-3'] },

    });
  });

  test('publish_event returns an error for a missing required field', async () => {
    const result = await mcpClient.callTool({
      name: 'publish_event',
      arguments: { eventId: 'step-1' },
    });

    expect(result.isError).toBe(true);
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;
    expect(text).toMatch(/workflowId|agentId|type|timestamp/);
  });

  test('publish_event returns an error for a wrong field type', async () => {
    const result = await mcpClient.callTool(makePublishEventInput({ eventId: 123 as any }));

    expect(result.isError).toBe(true);
  });

  test('start_workflow returns an error for a missing required field', async () => {
    const result = await mcpClient.callTool({
      name: 'start_workflow',
      arguments: { workflowId: 'wf-abc' },
    });

    expect(result.isError).toBe(true);
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;
    expect(text).toMatch(/agentId|timestamp|steps/);
  });

  test('start_workflow returns an error for a wrong field type', async () => {
    const result = await mcpClient.callTool(makeStartWorkflowEventInput({ payload: 'not-an-object' as any }));

    expect(result.isError).toBe(true);
  });

  test('publish_event surfaces an ingestion API error to the caller', async () => {
    apiClient.failWith(new Error('Ingestion API returned 500: Internal Server Error'));

    const result = await mcpClient.callTool(makePublishEventInput());

    expect(result.isError).toBe(true);
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;
    expect(text).toMatch(/500|Internal Server Error/);
  });
});
