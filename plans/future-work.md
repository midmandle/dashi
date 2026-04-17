# Future Work

Items deliberately deferred from the MVP. Revisit when the relevant area is stable.

---

## Event streaming

- **Filter SSE stream by `workflowId`** — the SSE connection currently delivers all events globally. As agent count grows, clients should be able to subscribe to a specific `workflowId` to reduce noise and unnecessary data transfer.
