import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { MeterClient } from "../client.js";

interface UsageResponse {
  total_cost: number;
  total_requests: number;
  currency: string;
  period: { start: string; end: string };
  breakdown: Array<{
    model: string;
    provider: string;
    requests: number;
    cost: number;
    input_tokens: number;
    output_tokens: number;
  }>;
}

export function registerGetUsage(server: McpServer, client: MeterClient) {
  server.tool(
    "get_usage",
    "Get usage and costs for a project or time period. Returns cost breakdown by model.",
    {
      project_id: z
        .string()
        .optional()
        .describe("Filter by project ID. Omit for all projects."),
      period: z
        .enum(["today", "week", "month", "all"])
        .optional()
        .describe("Time period. Defaults to 'month'."),
    },
    async ({ project_id, period }) => {
      const params = new URLSearchParams();
      if (project_id) params.set("project_id", project_id);
      if (period) params.set("period", period);

      const query = params.toString();
      const path = `/v1/usage${query ? `?${query}` : ""}`;

      const data = await client.get<UsageResponse>(path);

      const lines = [
        `**Usage (${data.period.start} → ${data.period.end})**`,
        `Total: ${data.currency}${data.total_cost.toFixed(4)} across ${data.total_requests} requests`,
        "",
        "| Model | Requests | Cost | Input Tokens | Output Tokens |",
        "|-------|----------|------|--------------|---------------|",
      ];

      for (const row of data.breakdown) {
        lines.push(
          `| ${row.model} | ${row.requests} | ${data.currency}${row.cost.toFixed(4)} | ${row.input_tokens.toLocaleString()} | ${row.output_tokens.toLocaleString()} |`
        );
      }

      return { content: [{ type: "text" as const, text: lines.join("\n") }] };
    }
  );
}
