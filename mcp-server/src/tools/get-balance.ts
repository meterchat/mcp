import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { MeterClient } from "../client.js";

interface BalanceResponse {
  balance: number;
  currency: string;
  budgets: Array<{
    project_id: string;
    project_name: string;
    limit: number;
    used: number;
    remaining: number;
    period: string;
  }>;
}

export function registerGetBalance(server: McpServer, client: MeterClient) {
  server.tool(
    "get_balance",
    "Check remaining balance and budget status across all projects.",
    {},
    async () => {
      const data = await client.get<BalanceResponse>("/v1/balance");

      const lines = [
        `**Account Balance: ${data.currency}${data.balance.toFixed(2)}**`,
      ];

      if (data.budgets.length > 0) {
        lines.push(
          "",
          "**Budgets:**",
          "| Project | Limit | Used | Remaining | Period |",
          "|---------|-------|------|-----------|--------|"
        );
        for (const b of data.budgets) {
          lines.push(
            `| ${b.project_name} | ${data.currency}${b.limit.toFixed(2)} | ${data.currency}${b.used.toFixed(2)} | ${data.currency}${b.remaining.toFixed(2)} | ${b.period} |`
          );
        }
      }

      return { content: [{ type: "text" as const, text: lines.join("\n") }] };
    }
  );
}
