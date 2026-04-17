# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this directory.

## Role

Serves the dashboard and delivers live event updates to browser clients. Runs as a persistent Node.js process on ECS — Lambda is not suitable here because SSE requires a long-lived connection.

## Responsibilities

- `GET /events` — returns all recent events for a workflow from the Redis cache (no DynamoDB reads)
- `GET /events/stream` — SSE endpoint; streams new events to the browser as they arrive
- On startup, subscribe to the Redis pub/sub channel; forward each message to all active SSE connections
- Serve the static dashboard build (or proxy to Vite in development)

## Key behaviours

- Initial event load on client connect is served from the Redis cache (list keyed by `workflowId`), not DynamoDB
- SSE stream is currently global (all events); per-`workflowId` filtering is deferred to future work
- Consider client-side deduplication — the initial cache fetch and live SSE stream may overlap

## Infrastructure

Provisioned via Terraform in `../infra`:
- ECS service and task definition
- Application Load Balancer
- Redis connection details injected via ECS task environment variables

## Dependencies

- `packages/schema` — event types
- Redis (ElastiCache) — pub/sub subscriber + cache reader

## Relevant tickets

- [2.1 — Single-agent timeline with hardcoded data](../plans/tickets/2.1-single-agent-timeline-hardcoded.md) — initial `GET /events` endpoint
- [2.3 — Live event streaming](../plans/tickets/2.3-live-event-streaming.md) — SSE + Redis integration
