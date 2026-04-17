# Vision: Dashi

## Problem
Engineering teams using AI agents for software delivery have no way to track delivery progress across agents at scale. Existing tools (e.g. LangSmith) focus on AI model performance — not on what agents are actually delivering or where projects stand.

## Target users
Engineering teams, engineering managers, and stakeholders at organisations using AI agents to deliver software. A concrete example: a senior engineer running 3–5 agents in parallel across a single feature, and their manager who needs to know what's shipped and what's next — without reading logs.

## Outcome
Users have a single place to see all running agents, what they're working on, and how delivery is progressing — without needing to instrument each agent differently or chase status updates manually.

## Scope
**In:**
- A generic event-publishing protocol that any agent can push updates to
- A read-only dashboard displaying agent progress (timeline + progress bar for MVP)
- Multi-agent visibility on a single screen
- Scalable event ingestion as agent count grows

**Out:**
- Agent orchestration or control (pause, reassign, approve)
- AI tool performance metrics (latency, cost, token usage)
- Framework-specific integrations (LangChain, CrewAI, etc.)
- Custom/configurable views (post-MVP)

## Success metrics
1. A user can observe the live progress of multiple concurrent agents on one screen
2. The system handles increasing agent count without degradation (scale is a hard requirement, not a nice-to-have)

## Constraints
- Solo developer — architecture must stay simple enough to ship incrementally
- MVP is intentionally narrow: event ingestion service + timeline/progress bar only
- No agent control in scope — Dashi is an observer, not an orchestrator
