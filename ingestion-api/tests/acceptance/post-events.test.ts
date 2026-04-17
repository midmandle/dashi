import { APIGatewayProxyEvent } from 'aws-lambda';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { handler } from '../../src/handler';

jest.mock('@aws-sdk/lib-dynamodb');
jest.mock('@aws-sdk/client-dynamodb');

function makeEvent(body: unknown): APIGatewayProxyEvent {
  return {
    body: body === undefined ? null : JSON.stringify(body),
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

const validEvent = {
  eventId: 'step-1',
  workflowId: 'wf-abc',
  agentId: 'agent-xyz',
  type: 'step_started',
  timestamp: '2026-04-15T10:00:00.000Z',
};

describe('POST /events', () => {
  const mockSend = jest.fn().mockResolvedValue({});

  beforeEach(() => {
    jest.clearAllMocks();
    mockSend.mockResolvedValue({});
    (DynamoDBDocumentClient.from as jest.Mock).mockReturnValue({ send: mockSend });
    (PutCommand as unknown as jest.Mock).mockImplementation((input) => ({ input }));
    process.env.DYNAMODB_TABLE_NAME = 'dashi-events';
  });

  test('POST /events with an empty body returns 400', async () => {
    const response = (await handler(makeEvent(undefined), {} as any, {} as any))!;
    expect(response.statusCode).toBe(400);
  });

  test('POST /events with a missing required field returns 400 with a descriptive error', async () => {
    const body = { eventId: 'step-1', workflowId: 'wf-abc' }; // missing agentId, type, timestamp
    const response = (await handler(makeEvent(body), {} as any, {} as any))!;
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body).error).toBeTruthy();
  });

  test('POST /events with a wrong field type returns 400 with a descriptive error', async () => {
    const body = { ...validEvent, eventId: 123 }; // eventId should be a string
    const response = (await handler(makeEvent(body), {} as any, {} as any))!;
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body).error).toMatch(/eventId/i);
  });

  test('valid event returns 201 and writes to DynamoDB', async () => {
    const response = (await handler(makeEvent(validEvent), {} as any, {} as any))!;

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
    });
  });
});
