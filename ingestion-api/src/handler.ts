import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { EventSchema } from '@dashi/schema';
import { EventRepository } from './event-repository';
import { DynamoDbEventRepository } from './dynamo-db-event-repository';

export class Handler {
  constructor(private readonly repository: EventRepository) {}

  async handle(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    if (!event.body) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Request body is required' }) };
    }

    const result = EventSchema.safeParse(JSON.parse(event.body));
    if (!result.success) {
      const error = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
      return { statusCode: 400, body: JSON.stringify({ error }) };
    }

    await this.repository.save(result.data);

    return { statusCode: 201, body: '' };
  }
}

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const instance = new Handler(new DynamoDbEventRepository(client, process.env.DYNAMODB_TABLE_NAME!));

export const handler: APIGatewayProxyHandler = (event) => instance.handle(event);
