import { Event } from '@dashi/schema';
import { IngestionApiClient } from './ingestion-api-client';

export class FetchIngestionApiClient implements IngestionApiClient {
  constructor(private readonly baseUrl: string) {}

  async publishEvent(event: Event): Promise<void> {
    const response = await fetch(`${this.baseUrl}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      throw new Error(`Ingestion API returned ${response.status}: ${response.statusText}`);
    }
  }
}
