import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { MeterClient } from "../client.js";

interface Decision {
  id: string;
  title: string;
  status: string;
  summary: string;
  tags: string[];
  created_at: string;
}

interface DecisionsResponse {
  decisions: Decision[];
  total: number;
}

export function registerGetDecisions(server: McpServer, client: MeterClient) {
  server.tool(
    "get_decisions",
    "Fetch decisions from your meter.chat decisions log. Decisions are structured records of choices made during AI conversations — the problem, options considered, what was decided, and why.",
    {
      query: z
        .string()
        .optional()
        .describe("Search/filter text across decision titles and content."),
      tag: z
        .string()
        .optional()
        .describe(
          'Filter by tag (e.g., "architecture", "api-design", "database").'
        ),
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

      const data = await client.get<DecisionsResponse>(
        `/v1/decisions?${params.toString()}`
      );

      if (data.decisions.length === 0) {
        return {
          content: [
            {
              type: "text" as const,
              text: "No decisions found. Try broadening your search or check your meter.chat account.",
            },
          ],
        };
      }

      const lines = [
        `**Decisions** (${data.decisions.length} of ${data.total})`,
        "",
        "| Title | Status | Tags | Date |",
        "|-------|--------|------|------|",
      ];

      for (const d of data.decisions) {
        const tags = d.tags.length > 0 ? d.tags.join(", ") : "—";
        const date = new Date(d.created_at).toLocaleDateString();
        lines.push(`| ${d.title} | ${d.status} | ${tags} | ${date} |`);
      }

      lines.push(
        "",
        'Use `get_decision` with a decision ID to see full details.'
      );

      return {
        content: [{ type: "text" as const, text: lines.join("\n") }],
      };
    }
  );
}
