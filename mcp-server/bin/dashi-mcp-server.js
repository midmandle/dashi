#!/usr/bin/env node
'use strict';

const { createServer } = require('../dist/server');
const { FetchIngestionApiClient } = require('../dist/fetch-ingestion-api-client');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');

const baseUrl = process.env.DASHI_INGESTION_URL;
if (!baseUrl) {
  console.error('Error: DASHI_INGESTION_URL environment variable is required');
  process.exit(1);
}

const client = new FetchIngestionApiClient(baseUrl);
const server = createServer(client);
const transport = new StdioServerTransport();

server.connect(transport).catch((err) => {
  console.error('Failed to start MCP server:', err);
  process.exit(1);
});
