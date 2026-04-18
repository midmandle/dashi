# Dashi

A read-only dashboard for monitoring AI agents delivering software. Agents publish events via MCP tools; engineers and managers watch their progress in real time.

Dashi is an **observer only** — no agent control, no orchestration.

---

## Architecture

```
AI Agent → MCP Server → Ingestion API → SQS → Event Processor → DynamoDB
                                                                      ↓
Browser ← Dashboard (React) ← API Server (SSE) ← Redis ← Stream Processor ← DynamoDB Streams
```

| Component | Technology | Role |
|---|---|---|
| MCP Server | Node/TypeScript | Agent-facing. Exposes `publish_event` and `start_workflow` MCP tools; forwards to Ingestion API |
| Ingestion API | Node/TypeScript (Lambda) | Validates events, enqueues to SQS |
| Event Processor | Node/TypeScript (Lambda) | Consumes SQS, writes to DynamoDB |
| Stream Processor | Node/TypeScript (Lambda) | Consumes DynamoDB Streams, publishes to Redis |
| API Server | Node/TypeScript (ECS) | Subscribes to Redis, maintains SSE connections to browser clients |
| Dashboard | React + Vite | Renders per-agent timeline and progress bar; reads SSE stream |
| Event Store | DynamoDB | Append-only event storage |
| Message Buffer | SQS | Decouples ingestion from processing |
| Live Relay | Redis (ElastiCache) | Pub/sub channel + recent-event cache keyed by `workflowId` |

Infrastructure is provisioned with Terraform. See `infra/` for all AWS resources (Lambda, API Gateway, ECS, DynamoDB, SQS, ElastiCache).

---

## Local Development

The full local stack runs via Docker Compose. The dashboard runs natively (Vite HMR works best outside Docker).

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) with Compose v2
- Node.js 20+

### First-time setup

```sh
cp .env.example .env
```

### Start the stack

```sh
npm run up
```

This builds and starts all services. On first run it will pull images and build the ingestion-api — subsequent starts are faster.

To run detached (background):

```sh
npm run up:detach
```

### Stop the stack

```sh
npm run down
```

### View logs

```sh
npm run logs          # all services
npm run logs:api      # ingestion-api only
```

### Service ports

| Service | URL |
|---|---|
| Ingestion API | http://localhost:3000 |
| DynamoDB Local | http://localhost:8000 |
| ElastiMQ (SQS API) | http://localhost:9324 |
| ElastiMQ (Management UI) | http://localhost:9325 |
| Redis | localhost:6379 |

### Sending a test event

```sh
curl -X POST http://localhost:3000/events \
  -H 'Content-Type: application/json' \
  -d '{
    "eventId": "e1",
    "workflowId": "w1",
    "agentId": "a1",
    "type": "workflow_started",
    "timestamp": "2026-01-01T00:00:00Z",
    "payload": { "steps": ["e1"] }
  }'
```

### Hot reload

Source changes to `ingestion-api/src/` and `packages/schema/src/` are picked up automatically — no rebuild needed. The service runs `tsx watch` inside the container against volume-mounted source.

---

## Project Structure

```
dashi/
├── packages/
│   └── schema/          # Shared Zod schema + inferred TypeScript types
├── ingestion-api/       # Lambda: POST /events → DynamoDB
├── mcp-server/          # MCP server (distributed via npx)
├── event-processor/     # Lambda: SQS consumer → DynamoDB  [Phase 3]
├── stream-processor/    # Lambda: DynamoDB Streams → Redis  [Phase 2]
├── api-server/          # ECS: Redis subscriber, SSE server  [Phase 2]
├── dashboard/           # React + Vite frontend              [Phase 2]
├── docker/
│   └── elasticmq.conf   # Pre-declares local SQS queues
├── infra/               # Terraform (AWS infrastructure)
└── plans/               # Architecture, roadmap, and ticket specs
```

This is an npm workspace monorepo. All packages share a single `node_modules` at the root.

### Adding a new service

When implementing a placeholder package:

1. Create `<service>/Dockerfile` following the pattern in `ingestion-api/Dockerfile` — copy workspace manifests, `npm install`, copy source, run `npx tsx watch src/local.ts`
2. Create `<service>/src/local.ts` as the local entry point:
   - **HTTP Lambda** — Express wrapper (see `ingestion-api/src/local.ts`)
   - **SQS Lambda** — SQS long-poll loop invoking the handler per message
   - **ECS long-running** — plain HTTP/SSE server, no Lambda wrapper needed
3. Uncomment the corresponding stub in `docker-compose.yml`
4. Add the package to the `workspaces` array in the root `package.json`

---

## Building and testing

```sh
npm run build   # build all packages
npm run test    # test all packages
```

Per-package:

```sh
npm run build --workspace=ingestion-api
npm test --workspace=ingestion-api
```

---

## Plans and tickets

Delivery is split into three phases:

- **Phase 1** — Event ingestion: Ingestion API, DynamoDB, MCP Server
- **Phase 2** — Live dashboard: React app, streaming pipeline, SSE, progress bar
- **Phase 3** — Scale: SQS pipeline, multi-workflow view, load testing

Ticket specs live in `plans/tickets/`. The architecture reference is `plans/high-level-architecture.md`.
