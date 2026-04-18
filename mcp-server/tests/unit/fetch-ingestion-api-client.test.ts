import { FetchIngestionApiClient } from '../../src/fetch-ingestion-api-client';
import { makePublishEventInput } from '../helpers';

describe('FetchIngestionApiClient', () => {
  let fetchSpy: jest.SpyInstance;

  beforeEach(() => {
    fetchSpy = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  test('POSTs the event as JSON to the ingestion API', async () => {
    fetchSpy.mockResolvedValue({ ok: true } as Response);
    const client = new FetchIngestionApiClient('https://api.example.com');
    const event = makePublishEventInput().arguments;

    await client.publishEvent(event);

    expect(fetchSpy).toHaveBeenCalledWith('https://api.example.com/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
  });

  test('throws an error with the status code on a non-2xx response', async () => {
    fetchSpy.mockResolvedValue({ ok: false, status: 500, statusText: 'Internal Server Error' } as Response);
    const client = new FetchIngestionApiClient('https://api.example.com');

    await expect(client.publishEvent(makePublishEventInput().arguments)).rejects.toThrow('500');
  });
});
