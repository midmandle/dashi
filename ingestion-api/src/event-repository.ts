import { Event } from '@dashi/schema';

export interface EventRepository {
  save(event: Event): Promise<void>;
}
