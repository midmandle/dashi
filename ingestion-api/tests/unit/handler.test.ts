import { Handler } from '../../src/handler';
import { EventRepository } from '../../src/event-repository';
import { makeEvent } from '../helpers';

const validEvent = {
  eventId: 'step-1',
  workflowId: 'wf-abc',
  agentId: 'agent-xyz',
  type: 'step_started' as const,
  timestamp: '2026-04-15T10:00:00.000Z',
};

describe('handler', () => {
  const mockRepository: EventRepository = { save: jest.fn() };
  const handler = new Handler(mockRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('saves the event and returns 201 for a valid request', async () => {
    const result = (await handler.handle(makeEvent(validEvent)))!;
    expect(result.statusCode).toBe(201);
    expect(mockRepository.save).toHaveBeenCalledWith(validEvent);
  });

  it('returns 400 when the request body is invalid', async () => {
    const result = (await handler.handle(makeEvent({ eventId: 'step-1' })))!;
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).error).toBeTruthy();
  });

  it('returns 400 when the request body is null', async () => {
    const result = (await handler.handle(makeEvent(null)))!;
    expect(result.statusCode).toBe(400);
  });
});
