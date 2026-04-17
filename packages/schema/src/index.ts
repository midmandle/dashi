import { z } from 'zod';

export const EventTypeSchema = z.enum([
  'workflow_started',
  'step_started',
  'step_completed',
]);

export type EventType = z.infer<typeof EventTypeSchema>;

export const WorkflowStartedPayloadSchema = z.object({
  steps: z.array(z.string()),
});

export type WorkflowStartedPayload = z.infer<typeof WorkflowStartedPayloadSchema>;

export const EventSchema = z.object({
  eventId: z.string(),
  workflowId: z.string(),
  agentId: z.string(),
  type: EventTypeSchema,
  timestamp: z.string(),
  payload: WorkflowStartedPayloadSchema.optional(),
});

export type Event = z.infer<typeof EventSchema>;
