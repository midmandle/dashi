import { Event } from '@dashi/schema';

export interface IngestionApiClient {
  publishEvent(event: Event): Promise<void>;
}
