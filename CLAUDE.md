# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

Dashi is a **greenfield project** — only planning documents exist at this stage. All code is yet to be written. The `plans/` directory is the source of truth for architecture, milestones, and tickets.

## What Dashi Is

A read-only dashboard for monitoring AI agents delivering software. Agents publish events via MCP tools; engineers and managers watch their progress in real time. Dashi is an **observer only** — no agent control, no orchestration.

## Architecture Overview

The full architecture is documented in [`plans/high-level-architecture.md`](plans/high-level-architecture.md). The key data flow:

```
AI Agent → MCP Server → Ingestion API → SQS → Event Processor → DynamoDB
                                                                      ↓
Browser ← Dashboard (React) ← API Server (SSE) ← Redis ← Stream Processor (Lambda) ← DynamoDB Streams
```

**Containers and their roles:**

| Container | Tech | Role |
|---|---|---|
| MCP Server | Node/TS | Agent-facing. Exposes `publish_event` and `start_workflow` tools; forwards to Ingestion API |
| Ingestion API | Node/TS (Lambda) | Validates events, enqueues to SQS |
| Event Processor | Node/TS (Lambda) | Consumes SQS, writes to DynamoDB |
| Stream Processor | Node/TS (Lambda) | Consumes DynamoDB Streams, publishes to Redis |
| API Server | Node/TS (ECS) | Subscribes to Redis, maintains SSE connections to browser clients |
| Dashboard | React + Vite | Reads SSE stream; renders per-agent timeline and progress bar |
| Event Store | DynamoDB | Append-only event storage. PK: `workflowId`, SK: `timestamp#eventId` |
| Message buffer | SQS | Decouples ingestion from processing |
| Live relay | Redis (ElastiCache) | Pub/sub channel + recent-event cache keyed by `workflowId` |

**Infrastructure:** AWS + Terraform (IaC from the start). All Lambda, API Gateway, ECS, DynamoDB, SQS, and ElastiCache resources are provisioned via Terraform.

**Language:** TypeScript throughout (all Lambda functions, API Server, MCP Server, Dashboard).

## Event Schema

The core schema (defined with Zod, TypeScript types inferred from it) includes:

- `eventId` — step identifier; maps to a position in `payload.steps` for progress tracking
- `workflowId` — groups events for a single agent run
- `agentId`
- `type` — one of: `workflow_started`, `step_started`, `step_completed`
- `timestamp`
- `payload` (optional) — for `workflow_started`: `{ steps: string[] }` (ordered list of expected `eventId`s)

Progress is inferred **client-side**: `step_completed` count / `payload.steps.length` from the `workflow_started` event.

## Shared Schema Package

The Zod schema and inferred TypeScript types are defined once (in ticket 1.1's ingestion service) and reused by the MCP Server and any other consumers. Never duplicate the schema across packages.

## MCP Server Distribution

The MCP Server is packaged to be runnable via `npx` so agents can reference it directly in their MCP config without a local install.

## Delivery Structure

Three phases, each with tickets in `plans/tickets/`:

- **Phase 1** (tickets 1.x) — Event ingestion: POST endpoint, DynamoDB, MCP server
- **Phase 2** (tickets 2.x) — Live dashboard: React app, stream processing pipeline, SSE, progress bar
- **Phase 3** (tickets 3.x) — Scale: SQS ingestion pipeline, multi-workflow dashboard, load testing

Each ticket file contains the user story, acceptance criteria, acceptance tests, and technical notes. Tickets are the primary implementation reference.

## Key Conventions (from ticket specs)

- Validation with **Zod**; export inferred TypeScript types from schemas
- API Gateway + Lambda for HTTP endpoints; ECS for the API Server (persistent SSE connections require a long-running process)
- DynamoDB Streams with `NEW_IMAGE` view — only the new record is needed downstream
- Redis cache keyed by `workflowId` as a list; no direct DynamoDB reads for the `GET /events` path
- `VITE_API_URL` env var injects the API endpoint into the React app

## Testing

See [`plans/test-strategy.md`](plans/test-strategy.md) for the full testing approach, including which test types apply to each context and test file structure conventions.
