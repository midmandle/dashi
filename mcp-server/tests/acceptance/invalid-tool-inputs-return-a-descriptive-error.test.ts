import { InMemoryIngestionApiClient, createTestClient } from '../helpers';

test('calling a tool with invalid inputs returns a descriptive error without calling the API', async () => {
  const apiClient = new InMemoryIngestionApiClient();
  const mcpClient = await createTestClient(apiClient);

  const result = await mcpClient.callTool({
    name: 'publish_event',
    arguments: { eventId: 'step-1' },
  });

  expect(result.isError).toBe(true);
  expect(apiClient.publishedEvents).toHaveLength(0);
});
