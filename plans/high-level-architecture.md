# High-Level Architecture — Dashi

## C4 Level 1 — Context

Two types of external actor interact with Dashi:

| Actor | Role |
|---|---|
| **AI Agent** | Any software agent delivering work. Publishes events to Dashi over HTTP via the MCP Server. |
| **User** (engineer / manager) | Views the dashboard in a browser. Read-only. |

Agents write, users read. Dashi is an observer — it has no control over agents.

Plan definition and annotation happens **outside of Dashi**. Dashi defines the event schema and annotation format that agents are expected to use; a separate Skill (development-time helper) assists users in annotating their plans correctly before execution begins.

---

## C4 Level 2 — Containers

```
                        ┌─────────────────────────────────────────────────────────────────┐
                        │                            Dashi                                 │
                        │                                                                  │
  AI Agent              │  ┌──────────────┐    ┌──────────┐    ┌────────────────────────┐ │
  (anywhere        ─────┼─▶│ Ingestion API│───▶│   SQS    │───▶│   Event Processor      │ │
  on internet)          │  │ (Node/TS)    │    │  Queue   │    │   (Node/TS)            │ │
       ▲                │  └──────────────┘    └──────────┘    └───────────┬────────────┘ │
       │                │                                                   │              │
  MCP Server            │                                                   ▼              │
  (Node/TS)             │                           ┌──────────────────────────────────┐  │
                        │                           │           DynamoDB               │  │
  User (browser) ───────┼─▶┌──────────────┐        │         (Event Store)            │  │
                        │  │  API Server  │        └──────────────────┬───────────────┘  │
                        │  │  (Node/TS)  │                             │                 │
                        │  │  ECS / SSE  │        DynamoDB Streams     │                 │
                        │  └──────┬───────┘                            │                 │
                        │         │                         ┌──────────▼───────────┐     │
                        │         │   subscribe             │  Stream Processor    │     │
                        │         │◀────────────┐           │  (Lambda/Node/TS)    │     │
                        │         │             │           └──────────┬───────────┘     │
                        │  ┌──────▼───────┐  ┌──┴─────────┐           │ publish         │
                        │  │  Dashboard   │  │   Redis     │◀──────────┘                 │
                        │  │  (React+Vite)│  │ (ElastiCache│                             │
                        │  │             │  │  pub/sub +  │                             │
                        └──┴─────────────┴──┴─────────────┴─────────────────────────────┘
```

---

## Containers

| Container | Technology | Responsibility |
|---|---|---|
| **MCP Server** | Node/TypeScript | Client-side integration point. Exposes Dashi's event protocol as MCP tools that agents call to publish events. Makes network calls to the Ingestion API. |
| **Ingestion API** | Node/TypeScript | Receives events from the MCP Server over HTTP. Validates and enqueues them to SQS. |
| **SQS Queue** | AWS SQS | Buffers incoming events. Decouples ingestion from processing and absorbs write spikes as agent count scales. |
| **Event Processor** | Node/TypeScript | Consumes events from SQS. Writes them to DynamoDB. |
| **Event Store** | AWS DynamoDB | Durable, scalable event storage. Append-heavy write pattern. Source of truth for all agent events. |
| **DynamoDB Streams** | AWS DynamoDB Streams | Emits a record for every write to the Event Store. Triggers the Stream Processor. |
| **Stream Processor** | AWS Lambda (Node/TypeScript) | Consumes DynamoDB Streams records. Publishes new events to Redis. |
| **Redis** | AWS ElastiCache (Redis) | Dual-purpose: pub/sub channel for the Stream Processor → API Server notification path; recent-event cache to serve new SSE clients without hitting DynamoDB. |
| **API Server** | Node/TypeScript (ECS) | Serves the dashboard. Subscribes to Redis for new events. Maintains SSE connections with browser clients and pushes live updates as they arrive. |
| **Dashboard** | React + Vite (browser) | Read-only web UI. Connects to the API Server via SSE. Renders a per-agent timeline and progress bar updated in near-real time. |

---

## Event Flow

1. A user defines a delivery plan for an agent outside of Dashi, annotating steps using the Dashi event schema (optionally assisted by the Dashi Skill).
2. The agent executes the plan and calls the **MCP Server** when starting or completing each step.
3. The MCP Server publishes the event to the **Ingestion API** over HTTP.
4. The Ingestion API validates the event and enqueues it to **SQS**.
5. The **Event Processor** consumes the message from SQS and writes the event to **DynamoDB**.
6. **DynamoDB Streams** emits a change record for the new write.
7. The **Stream Processor** (Lambda) picks up the record and publishes the event to **Redis**.
8. The **API Server** receives the event via its Redis subscription and pushes it to all connected browser clients over **SSE**.
9. The **Dashboard** receives the event and updates the relevant agent's timeline and progress bar.

When a new browser client connects, the API Server serves recent events from the **Redis cache** rather than querying DynamoDB directly, reducing read load on the event store.

---

## Key Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Event transport (agent → Dashi) | HTTP via MCP Server | Simple, universally accessible from any network. MCP provides a structured integration point for agents. |
| Ingestion buffer | AWS SQS | Decouples ingestion from processing; absorbs burst writes at scale without backpressure on agents. |
| Event store | AWS DynamoDB | Write-heavy, append-only workload; scales horizontally without relational overhead. Durable by default. |
| Stream Processor → API Server | Redis pub/sub (ElastiCache) | Decouples Lambda from ECS; no direct HTTP call between them. Redis also doubles as a recent-event cache to reduce DynamoDB read load. |
| Real-time delivery | DynamoDB Streams → Lambda → Redis → SSE | Change-driven (not polling); keeps dashboard near-real-time within seconds of event publication. |
| Browser connection | SSE | One-way server-to-browser stream; sufficient for a read-only dashboard and simpler than WebSockets. |
| API Server hosting | ECS | Persistent process required to maintain SSE connections and Redis subscriptions — Lambda is not suitable. |
| Authentication | Third-party provider (TBD) | Not rolling our own; specific provider deferred to implementation phase. |
| Infrastructure | AWS + Terraform | Greenfield; IaC from the start for repeatability and scalability. |
| Language | TypeScript throughout | Full-stack consistency; single language across all Node/Lambda containers. |

---

## Scale Characteristics

- **Target:** thousands of concurrent agents
- **Write path** (agent → DynamoDB) is fully decoupled via SQS — ingestion can scale independently of processing
- **Read path** (DynamoDB → browser) is event-driven via DynamoDB Streams — no polling under load
- **DynamoDB** scales horizontally by design; no relational bottlenecks
- **Redis cache** absorbs read traffic for new SSE client connections, limiting DynamoDB read load as dashboard user count grows
