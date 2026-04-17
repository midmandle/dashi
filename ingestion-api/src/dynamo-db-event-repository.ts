import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { Event } from '@dashi/schema';
import { EventRepository } from './event-repository';

export class DynamoDbEventRepository implements EventRepository {
  constructor(
    private readonly client: DynamoDBDocumentClient,
    private readonly tableName: string,
  ) {}

  async save(event: Event): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          ...event,
          pk: event.workflowId,
          sk: `${event.timestamp}#${event.eventId}`,
        },
      })
    );
  }
}
