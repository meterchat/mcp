#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createClient } from "./client.js";
import { registerGetDecisions } from "./tools/get-decisions.js";
import { registerGetDecision } from "./tools/get-decision.js";
import { registerGetBlueprints } from "./tools/get-blueprints.js";
import { registerGetBlueprint } from "./tools/get-blueprint.js";
import { registerGetDebates } from "./tools/get-debates.js";
import { registerSearch } from "./tools/search.js";
import { registerCreateDecision } from "./tools/create-decision.js";
import { registerRecentDecisionsResource } from "./resources/recent-decisions.js";
import { registerRecentBlueprintsResource } from "./resources/recent-blueprints.js";
import { registerProfileResource } from "./resources/profile.js";

const apiKey = process.env.METER_API_KEY;

if (!apiKey) {
  console.error(
    "METER_API_KEY environment variable is required. Get your key at https://meter.chat/settings/api"
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

// Tools — read
registerGetDecisions(server, client);
registerGetDecision(server, client);
registerGetBlueprints(server, client);
registerGetBlueprint(server, client);
registerGetDebates(server, client);
registerSearch(server, client);

// Tools — write
registerCreateDecision(server, client);

// Resources
registerRecentDecisionsResource(server, client);
registerRecentBlueprintsResource(server, client);
registerProfileResource(server, client);

const transport = new StdioServerTransport();
await server.connect(transport);
