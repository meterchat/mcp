import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { MeterClient } from "../client.js";

interface AccountResponse {
  id: string;
  email: string;
  plan: string;
  created_at: string;
}

export function registerAccountResource(
  server: McpServer,
  client: MeterClient
) {
  server.resource("account", "meter://account", async (uri) => {
    const data = await client.get<AccountResponse>("/v1/account");

    const text = [
      `**Meter Account**`,
      `- Email: ${data.email}`,
      `- Plan: ${data.plan}`,
      `- Account ID: ${data.id}`,
      `- Created: ${data.created_at}`,
    ].join("\n");

    return { contents: [{ uri: uri.href, mimeType: "text/markdown", text }] };
  });
}
