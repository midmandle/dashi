# Milestones — Dashi MVP

Milestones track incremental delivery within each phase of the [roadmap](roadmap.md).

---

## Phase 1 — Agent Status Updates

- Define the generic event schema
- Build the event ingestion service
- Build the MCP server (agent-facing integration point)
- Validate end-to-end with a test agent script

**Exit criteria:** Events published from an external agent are received and stored.

---

## Phase 2 — Live Agent Progress

- Timeline: live, ordered view of events for a single agent
- Progress bar: inferred by Dashi from the events received
- Layout foundation for the full dashboard

**Exit criteria:** A single agent's work unfolds in real time on screen.

---

## Phase 3 — Parallel Agent Monitoring

- All active agents visible simultaneously
- Per-agent timeline and progress bar in a compact layout
- Confirmed to handle concurrent agents without degradation

**Exit criteria:** A senior engineer can monitor multiple parallel agents from a single screen with no performance issues.
