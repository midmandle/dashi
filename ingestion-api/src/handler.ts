import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { EventSchema, DynamoDBKey } from '@dashi/schema';

export const handler: APIGatewayProxyHandler = async (event) => {
  const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}));

  if (!event.body) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Request body is required' }) };
  }

  const result = EventSchema.safeParse(JSON.parse(event.body));
  if (!result.success) {
    const error = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
    return { statusCode: 400, body: JSON.stringify({ error }) };
  }

  const item = result.data;

  await dynamo.send(
    new PutCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME!,
      Item: {
        ...item,
        pk: DynamoDBKey.pk(item.workflowId),
        sk: DynamoDBKey.sk(item.timestamp, item.eventId),
      },
    })
  );

  return { statusCode: 201, body: '' };
};
