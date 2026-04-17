---
name: roadmap
description: work with the user to define a roadmap based upoon a provided vision documnet
argument-hint: [document outlining product/feature vision]
---

This skill should take the vision information: `$ARGUMENTS` and iteratively work with the user to define a roadmap for delivering that vision.

The roadmap should:
- Be product-centric — phases named and described from the user's perspective (what capability is unlocked), not the technical implementation
- Stay at a high level — no technical milestones, tickets, or implementation details
- Each phase should include a short description and a **Capability** statement: what a user can do once this phase is complete

Work with the user iteratively to define the roadmap. Once all aspects of the vision have been addressed, write the roadmap to `plans/roadmap.md`.
