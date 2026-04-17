import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDbEventRepository } from '../../src/dynamo-db-event-repository';

jest.mock('@aws-sdk/lib-dynamodb');

const validEvent = {
  eventId: 'step-1',
  workflowId: 'wf-abc',
  agentId: 'agent-xyz',
  type: 'step_started' as const,
  timestamp: '2026-04-15T10:00:00.000Z',
};

describe('DynamoDbEventRepository', () => {
  const mockSend = jest.fn().mockResolvedValue({});
  const mockClient = { send: mockSend } as unknown as DynamoDBDocumentClient;
  const repository = new DynamoDbEventRepository(mockClient, 'dashi-events');

  beforeEach(() => {
    jest.clearAllMocks();
    mockSend.mockResolvedValue({});
    (PutCommand as unknown as jest.Mock).mockImplementation((input) => ({ input }));
  });

  it('writes the event to DynamoDB with pk=workflowId and sk=timestamp#eventId', async () => {
    await repository.save(validEvent);

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
});
