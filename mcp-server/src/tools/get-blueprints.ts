import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { MeterClient } from "../client.js";

interface Blueprint {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  created_at: string;
}

interface BlueprintsResponse {
  blueprints: Blueprint[];
  total: number;
}

export function registerGetBlueprints(server: McpServer, client: MeterClient) {
  server.tool(
    "get_blueprints",
    "Fetch blueprints from meter.chat. Blueprints are architectural plans, system designs, and technical documents generated from your AI conversations.",
    {
      query: z
        .string()
        .optional()
        .describe("Search text across blueprint titles and content."),
      tag: z
        .string()
        .optional()
        .describe("Filter by tag."),
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
    async ({ query, tag, limit, offset }) => {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (tag) params.set("tag", tag);
      params.set("limit", String(limit));
      params.set("offset", String(offset));

      const data = await client.get<BlueprintsResponse>(
        `/v1/blueprints?${params.toString()}`
      );

      if (data.blueprints.length === 0) {
        return {
          content: [
            {
              type: "text" as const,
              text: "No blueprints found. Try broadening your search or check your meter.chat account.",
            },
          ],
        };
      }

      const lines = [
        `**Blueprints** (${data.blueprints.length} of ${data.total})`,
        "",
        "| Title | Summary | Tags | Date |",
        "|-------|---------|------|------|",
      ];

      for (const bp of data.blueprints) {
        const tags = bp.tags.length > 0 ? bp.tags.join(", ") : "—";
        const date = new Date(bp.created_at).toLocaleDateString();
        const summary =
          bp.summary.length > 80
            ? bp.summary.slice(0, 77) + "..."
            : bp.summary;
        lines.push(`| ${bp.title} | ${summary} | ${tags} | ${date} |`);
      }

      lines.push(
        "",
        'Use `get_blueprint` with a blueprint ID to see the full document.'
      );

      return {
        content: [{ type: "text" as const, text: lines.join("\n") }],
      };
    }
  );
}
