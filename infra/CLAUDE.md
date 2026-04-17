# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this directory.

## Role

All AWS infrastructure, defined in Terraform. Every resource used by Dashi is provisioned here — nothing is created manually.

## Resources to provision (by phase)

**Phase 1**
- DynamoDB table (PK: `workflowId`, SK: `timestamp#eventId`; DynamoDB Streams enabled with `NEW_IMAGE`)
- SQS queue
- Ingestion API Lambda + REST API Gateway (`POST /events`)
- Event Processor Lambda + SQS event source mapping
- IAM roles and policies for all Lambdas

**Phase 2**
- ElastiCache Redis cluster (VPC-resident)
- Stream Processor Lambda + DynamoDB Streams event source mapping
- ECS cluster, task definition, and service for the API Server
- Application Load Balancer for the API Server
- `GET /events` Lambda + API Gateway route (Phase 2 ticket 2.1 — later replaced by the ECS API Server)
- VPC, subnets, and security groups for Lambda → Redis and ECS → Redis connectivity

**Phase 3**
- Review for scale: DynamoDB auto-scaling, SQS visibility timeouts, Redis instance sizing

## Conventions

- One `.tf` file per logical resource group (e.g. `dynamodb.tf`, `sqs.tf`, `ecs.tf`)
- All resource ARNs and connection strings passed to application code via environment variables — no hardcoded values in application code
- Remote state backend to be configured before first `terraform apply`
