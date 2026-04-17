# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this directory.

## Role

HTTP entry point for agent events. Receives `POST /events` requests, validates them using the shared schema from `packages/schema`, and enqueues valid events to SQS. Runs as a Lambda behind API Gateway.

## Responsibilities

- Validate the incoming event body (Zod); return `400` with a descriptive error on failure
- Enqueue valid events to SQS; return `201` on success
- No business logic — ingestion only

## Infrastructure

Provisioned via Terraform in `../infra`:
- Lambda function
- REST API Gateway with `POST /events` route

## Dependencies

- `packages/schema` — event validation
- SQS queue (ARN injected via Lambda environment variable)

## Relevant tickets

- [1.1 — Accept and store a single event](../plans/tickets/1.1-accept-and-store-a-single-event.md)
