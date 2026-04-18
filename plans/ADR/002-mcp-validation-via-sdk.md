# ADR 002 — MCP tool validation delegated to the SDK via Zod `inputSchema`

**Date:** 2026-04-18

Each tool registers a Zod schema as its `inputSchema`. The SDK validates before invoking the handler — the handler receives already-validated, typed arguments and does no further validation.

**Why:** Single validation point. Manual `safeParse` inside handlers is redundant and inconsistent.
