# ADR 005 — Separate concerns into dedicated classes

**Date:** 2026-04-18

Business logic is extracted into dedicated classes rather than kept inline in framework wiring (MCP tool handlers, Lambda handlers, etc.).

**Example:** `EventPublisher` handles event construction and forwarding to the ingestion API. `createServer` in `server.ts` handles only MCP tool registration and wiring. The two concerns do not mix.

**Why:** Framework wiring files (server setup, Lambda entry points) become hard to read and test when they also contain business logic. Dedicated classes have a clear single responsibility, are independently testable, and make the overall structure easier to navigate.

**Applies to:** All components across the project — MCP server tool handlers, Lambda handlers, API route handlers, etc.
