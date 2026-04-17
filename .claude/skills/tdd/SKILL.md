---
name: tdd
description: deliver a component using a TDD approach
---

Given a desired component, take a TDD approach to delivery. Work with the user to incrementally define the tests and implementation. Your approach should be as follows:

1: Identify the behaviours that need to be implemented for the desired component.
2: Write a single test for one behaviour. One test only — do not write multiple tests up front.
3: Get the user to review the test you generate.
4: Run the test without adding any implementation. Observe it fail for the correct reason.
5: Implement the minimum code needed to make that specific test pass — nothing more. Do not implement behaviour that is not yet covered by a test.
6: Re-run the test to confirm it goes green.
7: Check to see if there is any opportunity for refactoring. Propose the refactoring to the user and ask them if they want to proceed or adjust the refactoring. If there is no real benefit to the refactoring then allow the user to skip it.
8: Restart the process from step 2 until all the desired behaviours of the component have been test driven to completion.

Follow the test structure conventions in `plans/test-strategy.md`.
