import { z } from 'zod';

export const WorkflowStartedPayloadSchema = z.object({
  steps: z.array(z.string()),
});
export type WorkflowStartedPayload = z.infer<typeof WorkflowStartedPayloadSchema>;

export const StepStartedEventSchema = z.object({
  eventId:    z.string(),
  workflowId: z.string(),
  agentId:    z.string(),
  type:       z.literal('step_started'),
  timestamp:  z.string(),
});
export type StepStartedEvent = z.infer<typeof StepStartedEventSchema>;

export const StepCompletedEventSchema = z.object({
  eventId:    z.string(),
  workflowId: z.string(),
  agentId:    z.string(),
  type:       z.literal('step_completed'),
  timestamp:  z.string(),
});
export type StepCompletedEvent = z.infer<typeof StepCompletedEventSchema>;

export const WorkflowStartedEventSchema = z.object({
  eventId:    z.string(),
  workflowId: z.string(),
  agentId:    z.string(),
  type:       z.literal('workflow_started'),
  timestamp:  z.string(),
  payload:    WorkflowStartedPayloadSchema,
});
export type WorkflowStartedEvent = z.infer<typeof WorkflowStartedEventSchema>;

export const StepEventSchema = z.discriminatedUnion('type', [
  StepStartedEventSchema,
  StepCompletedEventSchema,
]);
export type StepEvent = z.infer<typeof StepEventSchema>;

export const EventSchema = z.discriminatedUnion('type', [
  StepStartedEventSchema,
  StepCompletedEventSchema,
  WorkflowStartedEventSchema,
]);
export type Event = z.infer<typeof EventSchema>;

export const StartWorkflowInputSchema = z.object({
  workflowId: z.string(),
  agentId:    z.string(),
  type:       z.literal('workflow_started'),
  timestamp:  z.string(),
  payload:    WorkflowStartedPayloadSchema,
});
export type StartWorkflowInput = z.infer<typeof StartWorkflowInputSchema>;
