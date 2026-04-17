---
name: deliver
description: iteratively work with the user to deliver a given ticket
---

Given a ticket description: $ARGUMENTS

Work with the user to iteratively work through the ticket until it has been delivered.

Take an outside-in acceptance driven approach. Use the specified acceptance tests on the ticket to write the solution test first. The acceptance test forms the outer loop of the outside-in approach.

1: Identify the order in which you will deliver each acceptance test.
2: Write a failing test for the next acceptance test. DO NOT write any implementation — only write enough scaffolding (empty exports, stub functions) to allow the test to compile and run. Watch it fail.
3: Once you have a failing acceptance test, use the failure to identify which component needs to be built next. DO NOT implement the component yet.
4: Scaffold the component — create the file and export a shell (e.g. a function that throws "Not implemented"). This is the minimum needed to enter the TDD inner loop.
5: Enter the inner loop defined in the tdd SKILL. Drive the component's implementation one unit test at a time until it satisfies what the acceptance test needs.
6: Re-run the acceptance test. If it is still red, identify the next failing component and repeat steps 4–5. Continue until the acceptance test goes green.
7: Move onto the next acceptance test and repeat from step 2 until all acceptance tests are green.
