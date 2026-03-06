import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { MeterClient } from "../client.js";

interface UsageSummaryResponse {
  currency: string;
  today: { cost: number; requests: number };
  week: { cost: number; requests: number };
  month: { cost: number; requests: number };
  top_models: Array<{ model: string; cost: number; requests: number }>;
}

export function registerUsageSummaryResource(
  server: McpServer,
  client: MeterClient
) {
  server.resource("usage-summary", "meter://usage/summary", async (uri) => {
    const data = await client.get<UsageSummaryResponse>("/v1/usage/summary");
    const c = data.currency;

    const lines = [
      "**Meter Usage Summary**",
      "",
      `| Period | Cost | Requests |`,
      `|--------|------|----------|`,
      `| Today | ${c}${data.today.cost.toFixed(4)} | ${data.today.requests} |`,
      `| This week | ${c}${data.week.cost.toFixed(4)} | ${data.week.requests} |`,
      `| This month | ${c}${data.month.cost.toFixed(4)} | ${data.month.requests} |`,
    ];

    if (data.top_models.length > 0) {
      lines.push(
        "",
        "**Top models this month:**",
        "| Model | Cost | Requests |",
        "|-------|------|----------|"
      );
      for (const m of data.top_models) {
        lines.push(`| ${m.model} | ${c}${m.cost.toFixed(4)} | ${m.requests} |`);
      }
    }

    return {
      contents: [
        { uri: uri.href, mimeType: "text/markdown", text: lines.join("\n") },
      ],
    };
  });
}
