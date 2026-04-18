# ADR 003 — `registerTool` called via `(server as any)` cast

**Date:** 2026-04-18

`server.registerTool()` is called via `const register = (server as any).registerTool.bind(server)`.

**Why:** MCP SDK v1.10+ uses a Zod v3/v4 compatibility union in its type signatures that exceeds TypeScript's instantiation depth limit (TS2589). The cast bypasses inference with no runtime cost. Revisit if the SDK resolves the type issue upstream.
