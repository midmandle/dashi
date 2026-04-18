# Tech Debt

Known shortcuts and deferred quality improvements. Items here are not blockers for MVP delivery but should be addressed before the relevant area is considered stable.

---

## Shared `makeEvent` test factory

A `makeEvent(overrides?)` factory that builds a valid Dashi `Event` is duplicated across `ingestion-api/tests/helpers.ts` and `mcp-server/tests/helpers.ts` (and likely future packages). It should live in `@dashi/schema` as a test utility and be imported from there. Note: `ingestion-api/tests/helpers.ts` has a different `makeEvent` that builds an `APIGatewayProxyEvent` — that one is Lambda-specific and should stay where it is.
