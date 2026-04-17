# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this directory.

## Role

The single source of truth for the Dashi event schema. Defines Zod schemas and exports inferred TypeScript types. Every other package that needs to read or write events depends on this package — never duplicate the schema elsewhere.

## Key types

- `Event` — the core event shape: `eventId`, `workflowId`, `agentId`, `type`, `timestamp`, `payload?`
- `EventType` — enum: `workflow_started`, `step_started`, `step_completed`
- `WorkflowStartedPayload` — `{ steps: string[] }` (ordered list of expected `eventId`s)

## DynamoDB key design

PK: `workflowId` | SK: `timestamp#eventId` — timestamp drives ordering, eventId breaks ties.

## Dependents

- `ingestion-api` — validates incoming events against the schema
- `mcp-server` — validates tool inputs before forwarding to the Ingestion API
- `event-processor` — types the events it writes to DynamoDB
- `stream-processor` — types the events it publishes to Redis

## Relevant tickets

- [1.1 — Accept and store a single event](../../plans/tickets/1.1-accept-and-store-a-single-event.md) — initial schema definition
- [2.4 — Workflow progress bar](../../plans/tickets/2.4-workflow-progress-bar.md) — adds `workflow_started`, `step_started`, `step_completed` types
