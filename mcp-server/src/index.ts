#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createClient } from "./client.js";
import { registerGetUsage } from "./tools/get-usage.js";
import { registerGetBalance } from "./tools/get-balance.js";
import { registerGetProjects } from "./tools/get-projects.js";
import { registerCreateProject } from "./tools/create-project.js";
import { registerSetBudget } from "./tools/set-budget.js";
import { registerGetCostEstimate } from "./tools/get-cost-estimate.js";
import { registerAccountResource } from "./resources/account.js";
import { registerPricingResource } from "./resources/pricing.js";
import { registerUsageSummaryResource } from "./resources/usage-summary.js";

const apiKey = process.env.METER_API_KEY;

if (!apiKey) {
  console.error(
    "METER_API_KEY environment variable is required. Get your key at https://meter.dev"
  );
  process.exit(1);
}

const client = createClient({
  apiKey,
  baseUrl: process.env.METER_API_URL,
});

const server = new McpServer({
  name: "meter",
  version: "0.1.0",
});

// Tools
registerGetUsage(server, client);
registerGetBalance(server, client);
registerGetProjects(server, client);
registerCreateProject(server, client);
registerSetBudget(server, client);
registerGetCostEstimate(server, client);

// Resources
registerAccountResource(server, client);
registerPricingResource(server, client);
registerUsageSummaryResource(server, client);

const transport = new StdioServerTransport();
await server.connect(transport);
