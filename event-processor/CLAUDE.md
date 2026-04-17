# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this directory.

## Role

Consumes events from SQS and writes them to DynamoDB. Runs as a Lambda triggered by the SQS queue.

## Responsibilities

- Read event messages from SQS
- Write each event to DynamoDB using the key design from `packages/schema` (PK: `workflowId`, SK: `timestamp#eventId`)
- No validation — events are pre-validated by the Ingestion API before reaching the queue

## Infrastructure

Provisioned via Terraform in `../infra`:
- Lambda function with SQS event source mapping
- IAM permissions to read from SQS and write to DynamoDB

## Dependencies

- `packages/schema` — event types
- SQS queue (ARN injected via Lambda environment variable)
- DynamoDB table (name injected via Lambda environment variable)

## Relevant tickets

- [1.1 — Accept and store a single event](../plans/tickets/1.1-accept-and-store-a-single-event.md)
