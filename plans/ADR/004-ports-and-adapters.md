# ADR 004 — Ports and adapters for API persistence layers

**Date:** 2026-04-18

API components (Lambda handlers, etc.) depend on a repository interface (port), not a concrete implementation. The concrete implementation (adapter) is injected at the composition root.

**Example:** `ingestion-api` defines `EventRepository` with a `save(event)` method. `Handler` takes an `EventRepository` in its constructor. `DynamoDbEventRepository` is the adapter wired up at the Lambda entry point.

**Why:** Decouples business logic from infrastructure. Swapping the persistence layer (e.g. DynamoDB → SQL) requires only a new adapter, not changes to the handler. Also makes unit testing straightforward — tests inject an in-memory adapter rather than mocking AWS SDK internals.

**Applies to:** All API components across the project.
