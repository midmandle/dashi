import { InMemoryIngestionApiClient, createTestClient, makeStartWorkflowEventInput } from '../helpers';

test('an agent can start a workflow with an ordered steps list', async () => {
  const apiClient = new InMemoryIngestionApiClient();
  const mcpClient = await createTestClient(apiClient);

  await mcpClient.callTool(makeStartWorkflowEventInput());

  expect(apiClient.publishedEvents).toHaveLength(1);
  expect(apiClient.publishedEvents[0]).toMatchObject({
    workflowId: 'wf-abc',
    agentId: 'agent-xyz',
    type: 'workflow_started',
    timestamp: '2026-04-15T10:00:00.000Z',
    payload: { steps: ['step-1', 'step-2', 'step-3'] },

  });
  expect(typeof apiClient.publishedEvents[0].eventId).toBe('string');
});
