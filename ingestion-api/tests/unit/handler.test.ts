import { APIGatewayProxyEvent } from 'aws-lambda';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { handler } from '../../src/handler';

jest.mock('@aws-sdk/lib-dynamodb');
jest.mock('@aws-sdk/client-dynamodb');

function makeEvent(body: string | null): APIGatewayProxyEvent {
  return {
    body,
    headers: {},
    multiValueHeaders: {},
    httpMethod: 'POST',
    isBase64Encoded: false,
    path: '/events',
    pathParameters: null,
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    stageVariables: null,
    requestContext: {} as APIGatewayProxyEvent['requestContext'],
    resource: '/events',
  };
}

const validBody = JSON.stringify({
  eventId: 'step-1',
  workflowId: 'wf-abc',
  agentId: 'agent-xyz',
  type: 'step_started',
  timestamp: '2026-04-15T10:00:00.000Z',
});

describe('handler', () => {
  const mockSend = jest.fn().mockResolvedValue({});

  beforeEach(() => {
    jest.clearAllMocks();
    mockSend.mockResolvedValue({});
    (DynamoDBDocumentClient.from as jest.Mock).mockReturnValue({ send: mockSend });
    (PutCommand as unknown as jest.Mock).mockImplementation((input) => ({ input }));
    process.env.DYNAMODB_TABLE_NAME = 'dashi-events';
  });

  it('returns 201 for a valid event', async () => {
    const result = (await handler(makeEvent(validBody), {} as any, {} as any))!;
    expect(result.statusCode).toBe(201);
  });

  it('returns 400 with a descriptive error when a required field is missing', async () => {
    const body = JSON.stringify({ eventId: 'step-1', workflowId: 'wf-abc' });
    const result = (await handler(makeEvent(body), {} as any, {} as any))!;
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).error).toBeTruthy();
  });

  it('returns 400 with a descriptive error when a field has the wrong type', async () => {
    const body = JSON.stringify({ ...JSON.parse(validBody), eventId: 123 });
    const result = (await handler(makeEvent(body), {} as any, {} as any))!;
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).error).toMatch(/eventId/i);
  });

  it('returns 400 when body is null', async () => {
    const result = (await handler(makeEvent(null), {} as any, {} as any))!;
    expect(result.statusCode).toBe(400);
  });

  it('writes the event to DynamoDB with pk=workflowId and sk=timestamp#eventId', async () => {
    await handler(makeEvent(validBody), {} as any, {} as any);

    expect(mockSend).toHaveBeenCalledTimes(1);
    const putCommand = (mockSend.mock.calls[0][0] as InstanceType<typeof PutCommand>);
    expect(putCommand.input.TableName).toBe('dashi-events');
    expect(putCommand.input.Item).toMatchObject({
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
