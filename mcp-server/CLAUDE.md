# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this directory.

## Role

Agent-facing integration point. Exposes Dashi's event protocol as MCP tools that agents call during execution. Makes HTTP calls to the Ingestion API — agents never call the Ingestion API directly.

## Tools

- `publish_event` — publishes a step-level event (`step_started`, `step_completed`). Validates inputs locally before calling `POST /events`.
- `start_workflow` — publishes a `workflow_started` event with an ordered list of expected step `eventId`s in `payload.steps`. This manifest is what Dashi uses to infer progress in Phase 2.

## Key behaviours

- Validate inputs with the shared Zod schema before hitting the network; return a descriptive error without calling the API if validation fails
- Ingestion API base URL is configurable (environment variable or MCP config)
- Surface non-2xx responses from the Ingestion API as errors to the caller

## Distribution

Packaged to run via `npx` so agents can reference it directly in their MCP config without a local install.

## Dependencies

- `packages/schema` — shared event types and validation
- `ingestion-api` — forwards all events to `POST /events`

## Relevant tickets

- [1.2 — Publish an event via MCP](../plans/tickets/1.2-publish-an-event-via-mcp.md)
