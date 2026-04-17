---
name: review
description: Review the code written for a given ticket
---

Given a ticket: $ARGUMENTS

Guide the user through a review of the code written to deliver the ticket. The review is user-driven — present each file or area in turn, share observations, and let the user direct what to address and in what order.

1. **List the files** created or modified for the ticket in logical dependency order — foundational code first (schemas, interfaces), then infrastructure, then application code, then tests.

2. **Follow the tests** — start with the first acceptance test, then work down through the unit tests in the order they were written, then into the implementation they drove out.

3. **At each step**, share your observations and wait for the user to decide what to address. Refactor only when directed. After any change, run the tests to confirm green before continuing.

4. **Capture design decisions** — when the user makes a decision that should apply across the whole project, save it to memory so it carries forward into future tickets.
