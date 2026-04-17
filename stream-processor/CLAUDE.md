# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this directory.

## Role

Bridges DynamoDB and Redis. Triggered by DynamoDB Streams whenever a new event is written to the Event Store. Publishes each event to Redis for the API Server to relay to connected browser clients.

## Responsibilities

- Consume DynamoDB Streams records (stream view type: `NEW_IMAGE`)
- Publish each new event to a Redis pub/sub channel
- Append each new event to a Redis list keyed by `workflowId` (the recent-event cache)
- No direct HTTP calls — Redis is the only integration point

## Infrastructure

Provisioned via Terraform in `../infra`:
- Lambda function with DynamoDB Streams event source mapping
- ElastiCache Redis cluster
- IAM permissions and VPC config to allow Lambda → ElastiCache access

## Dependencies

- `packages/schema` — event types
- DynamoDB Streams (configured on the Event Store table)
- Redis (ElastiCache) — connection details injected via Lambda environment variables

## Relevant tickets

- [2.2 — Stream processing pipeline](../plans/tickets/2.2-stream-processing-pipeline.md)
