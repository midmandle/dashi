# Test Strategy

## Test types by context

| Context | Test type |
|---|---|
| Backend-only tickets | Acceptance tests only |
| Tickets involving the frontend | E2E tests only |

Do not write standalone unit tests as deliverables. Unit tests are used as the inner TDD loop when driving a component's implementation (see the `tdd` skill), but they are a means to an end — the acceptance or E2E test is the deliverable.

## Acceptance tests

Acceptance tests are written at the system component level and exercise the component within its own boundaries. For example, the ingestion-api Lambda's acceptance tests invoke the handler directly with an API Gateway event shape and assert on the response and side-effects — the Lambda is the system under test.

Anything on the component's boundary (downstream AWS services, external HTTP servers) is replaced with a mock or fake. The test stays entirely within the component's scope.

- One acceptance test per scenario from the ticket's acceptance criteria.

## TDD inner loop (unit tests)

Unit tests written during the TDD inner loop follow these rules:

- **One test at a time.** Write a single failing test, implement the minimum to pass it, then write the next. Never write multiple tests before having green.
- **Minimum implementation.** Only implement enough to make the current test pass. Do not anticipate future tests.

## Test file structure

- A single `describe` block per file, named after the component under test (e.g. `describe('handler', ...)`).
- Do not nest `describe` blocks.
- Each `it` / `test` carries the full descriptive burden of the scenario being tested.
