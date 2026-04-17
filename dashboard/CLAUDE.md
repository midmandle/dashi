# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this directory.

## Role

Read-only browser UI. Connects to the API Server via SSE and renders a per-workflow timeline and progress bar, updating in real time as events arrive.

## Key behaviours

- On load: fetch existing events from `GET /events` (backed by Redis cache)
- Subsequently: receive new events via SSE without page refresh
- Group events by `workflowId`; render one panel per workflow
- Progress bar per workflow — calculated client-side:
  - `progress = step_completed_count / payload.steps.length`
  - Source `payload.steps` from the `workflow_started` event for that workflow
  - Steps with `step_started` but no `step_completed` are shown as in-progress
  - Workflows with no `workflow_started` event render without a progress bar

## Configuration

- `VITE_API_URL` — Ingestion API base URL, injected at build time

## Layout constraint

The layout must accommodate multiple workflow panels (Phase 3). Even while rendering a single workflow, structure the layout so adding more panels requires no restructuring.

## Tech stack

React + Vite. No framework preferences specified beyond that.

## E2E tests

E2E tests are required for tickets involving this component (tickets 2.3, 2.4). Acceptance tests only for non-UI tickets.

## Relevant tickets

- [2.1 — Single-agent timeline with hardcoded data](../plans/tickets/2.1-single-agent-timeline-hardcoded.md)
- [2.3 — Live event streaming](../plans/tickets/2.3-live-event-streaming.md)
- [2.4 — Workflow progress bar](../plans/tickets/2.4-workflow-progress-bar.md)
- [3.2 — Multi-workflow dashboard](../plans/tickets/3.2-multi-workflow-dashboard.md)
