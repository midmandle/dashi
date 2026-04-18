---
name: review
description: Review the code written for a given ticket
---

Given a ticket: $ARGUMENTS

Guide the user through a review of the code written to deliver the ticket. The review is user-driven — present each file or area in turn, share observations, and let the user direct what to address and in what order.

1. **List the files** created or modified for the ticket in logical dependency order — foundational code first (schemas, interfaces), then infrastructure, then application code, then tests.

2. **Follow the tests in delivery order** — for each acceptance test in turn:
   - Review the acceptance test first
   - Then review the unit tests that were written to drive out its implementation
   - Then review the implementation those unit tests produced
   - Then move on to the next acceptance test and repeat

   Do not review all acceptance tests first and then all unit tests — keep the flow coupled per acceptance test, mirroring the outside-in delivery order.

3. **At each step**, share your observations and wait for the user to decide what to address. Refactor only when directed. After any change, run the tests to confirm green before continuing.

4. **Review remaining files** — after the full test chain is complete, identify any changed files that were not covered (e.g. config files, interfaces, CLI entry points, shared packages). Review these independently, in the same user-driven style.

5. **Capture design decisions** — when the user makes a decision that should apply across the whole project, save it to memory so it carries forward into future tickets.
