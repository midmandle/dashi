import { InMemoryIngestionApiClient, createTestClient, makePublishEventInput } from '../helpers';

test('an agent can publish a step event via MCP', async () => {
  const apiClient = new InMemoryIngestionApiClient();
  const mcpClient = await createTestClient(apiClient);

  await mcpClient.callTool(makePublishEventInput());

  expect(apiClient.publishedEvents).toHaveLength(1);
  expect(apiClient.publishedEvents[0]).toMatchObject({
    eventId: 'step-1',
    workflowId: 'wf-abc',
    agentId: 'agent-xyz',
    type: 'step_started',
    timestamp: '2026-04-15T10:00:00.000Z',
  });
});
