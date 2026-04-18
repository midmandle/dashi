import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StepEvent, StepEventSchema, StartWorkflowInput, StartWorkflowInputSchema } from '@dashi/schema';
import { IngestionApiClient } from './ingestion-api-client';
import { EventPublisher } from './event-publisher';

export function createServer(client: IngestionApiClient): McpServer {
  const server = new McpServer({ name: 'dashi-mcp-server', version: '1.0.0' });
  const publisher = new EventPublisher(client);

  // Cast to any to avoid TS2589: SDK's Zod v3/v4 compat union types exceed TypeScript's instantiation depth limit
  const register = (server as any).registerTool.bind(server);

  register(
    'publish_event',
    {
      description: 'Publish a step-level event (step_started or step_completed) to Dashi',
      inputSchema: StepEventSchema,
    },
    async (args: StepEvent) => publisher.publish(args, 'Event published successfully')
  );

  register(
    'start_workflow',
    {
      description: 'Declare a workflow and its expected steps. Publishes a workflow_started event.',
      inputSchema: StartWorkflowInputSchema,
    },
    async (args: StartWorkflowInput) => publisher.publish(args, 'Workflow started successfully')
  );

  return server;
}
