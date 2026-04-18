import express, { Request, Response } from 'express';
import { DynamoDBClient, CreateTableCommand, DescribeTableCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { Handler } from './handler';
import { DynamoDbEventRepository } from './dynamo-db-event-repository';

const PORT = parseInt(process.env.PORT ?? '3000', 10);
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME!;

async function ensureTable(client: DynamoDBClient): Promise<void> {
  try {
    await client.send(new DescribeTableCommand({ TableName: TABLE_NAME }));
  } catch {
    await client.send(
      new CreateTableCommand({
        TableName: TABLE_NAME,
        BillingMode: 'PAY_PER_REQUEST',
        KeySchema: [
          { AttributeName: 'pk', KeyType: 'HASH' },
          { AttributeName: 'sk', KeyType: 'RANGE' },
        ],
        AttributeDefinitions: [
          { AttributeName: 'pk', AttributeType: 'S' },
          { AttributeName: 'sk', AttributeType: 'S' },
        ],
      })
    );
    console.log(`Created table "${TABLE_NAME}"`);
  }
}

async function start(): Promise<void> {
  const dynamoClient = new DynamoDBClient({});
  await ensureTable(dynamoClient);

  const docClient = DynamoDBDocumentClient.from(dynamoClient);
  const handlerInstance = new Handler(new DynamoDbEventRepository(docClient, TABLE_NAME));

  const app = express();
  app.use(express.text({ type: 'application/json' }));

  app.post('/events', async (req: Request, res: Response) => {
    const event: APIGatewayProxyEvent = {
      body: typeof req.body === 'string' ? req.body : null,
      httpMethod: 'POST',
      path: '/events',
      headers: req.headers as Record<string, string>,
      queryStringParameters: null,
      pathParameters: null,
      stageVariables: null,
      requestContext: {} as APIGatewayProxyEvent['requestContext'],
      resource: '/events',
      isBase64Encoded: false,
      multiValueHeaders: {},
      multiValueQueryStringParameters: null,
    };

    const result = await handlerInstance.handle(event);
    res.status(result.statusCode).send(result.body);
  });

  app.listen(PORT, () => {
    console.log(`Ingestion API running at http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start:', err);
  process.exit(1);
});
