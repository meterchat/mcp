import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { MeterClient } from "../client.js";

interface Debate {
  id: string;
  topic: string;
  models: string[];
  synthesis: string;
  created_at: string;
}

interface DebatesResponse {
  debates: Debate[];
  total: number;
}

export function registerGetDebates(server: McpServer, client: MeterClient) {
  server.tool(
    "get_debates",
    "Fetch debate summaries from meter.chat. Debates are multi-model discussions where different AI models argue perspectives on a topic, producing a synthesis.",
    {
      query: z.string().optional().describe("Search text across debate topics."),
      limit: z
        .number()
        .int()
        .positive()
        .optional()
        .default(20)
        .describe("Max results to return."),
      offset: z
        .number()
        .int()
        .min(0)
        .optional()
        .default(0)
        .describe("Pagination offset."),
    },
    async ({ query, limit, offset }) => {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      params.set("limit", String(limit));
      params.set("offset", String(offset));

      const data = await client.get<DebatesResponse>(
        `/v1/debates?${params.toString()}`
      );

      if (data.debates.length === 0) {
        return {
          content: [
            {
              type: "text" as const,
              text: "No debates found. Try broadening your search or check your meter.chat account.",
            },
          ],
        };
      }

      const lines = [
        `**Debates** (${data.debates.length} of ${data.total})`,
        "",
      ];

      for (const d of data.debates) {
        const date = new Date(d.created_at).toLocaleDateString();
        const models = d.models.join(" vs ");
        lines.push(
          `### ${d.topic}`,
          `**Models:** ${models} | **Date:** ${date}`,
          "",
          d.synthesis,
          ""
        );
      }

      return {
        content: [{ type: "text" as const, text: lines.join("\n") }],
      };
    }
  );
}
