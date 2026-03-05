import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { MeterClient } from "../client.js";

interface SetBudgetResponse {
  project_id: string;
  limit: number;
  period: string;
  currency: string;
}

export function registerSetBudget(server: McpServer, client: MeterClient) {
  server.tool(
    "set_budget",
    "Set or update a budget limit on a project. When the budget is reached, requests are blocked until the next period.",
    {
      project_id: z.string().describe("The project ID to set the budget on."),
      limit: z
        .number()
        .positive()
        .describe("Budget limit in USD (e.g., 50 for $50)."),
      period: z
        .enum(["daily", "weekly", "monthly"])
        .optional()
        .describe("Budget period. Defaults to 'monthly'."),
    },
    async ({ project_id, limit, period }) => {
      const data = await client.put<SetBudgetResponse>(
        `/v1/projects/${project_id}/budget`,
        { limit, period: period || "monthly" }
      );

      return {
        content: [
          {
            type: "text" as const,
            text: `Budget set.\n\n- **Project:** ${data.project_id}\n- **Limit:** ${data.currency}${data.limit.toFixed(2)} / ${data.period}`,
          },
        ],
      };
    }
  );
}
