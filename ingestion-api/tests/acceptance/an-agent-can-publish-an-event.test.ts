import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { Handler } from '../../src/handler';
import { DynamoDbEventRepository } from '../../src/dynamo-db-event-repository';
import { makeEvent } from '../helpers';

jest.mock('@aws-sdk/lib-dynamodb');
jest.mock('@aws-sdk/client-dynamodb');

const mockSend = jest.fn().mockResolvedValue({});

beforeEach(() => {
  jest.clearAllMocks();
  mockSend.mockResolvedValue({});
  (DynamoDBDocumentClient.from as jest.Mock).mockReturnValue({ send: mockSend });
  (PutCommand as unknown as jest.Mock).mockImplementation((input) => ({ input }));
});

test('an agent can publish an event', async () => {
  const repository = new DynamoDbEventRepository(
    DynamoDBDocumentClient.from(new DynamoDBClient({})),
    'dashi-events'
  );
  const handler = new Handler(repository);

  const response = (await handler.handle(makeEvent({
    eventId: 'step-1',
    workflowId: 'wf-abc',
    agentId: 'agent-xyz',
    type: 'step_started',
    timestamp: '2026-04-15T10:00:00.000Z',
  })))!;

  expect(response.statusCode).toBe(201);
  expect(mockSend).toHaveBeenCalledTimes(1);
  const { input } = mockSend.mock.calls[0][0];
  expect(input.TableName).toBe('dashi-events');
  expect(input.Item).toMatchObject({
    workflowId: 'wf-abc',
    eventId: 'step-1',
    agentId: 'agent-xyz',
    type: 'step_started',
    timestamp: '2026-04-15T10:00:00.000Z',
    pk: 'wf-abc',
    sk: '2026-04-15T10:00:00.000Z#step-1',
  });
});
