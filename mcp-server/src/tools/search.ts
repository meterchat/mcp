import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { MeterClient } from "../client.js";

interface SearchResult {
  type: "decision" | "blueprint" | "debate" | "conversation";
  id: string;
  title: string;
  snippet: string;
  created_at: string;
}

interface SearchResponse {
  results: SearchResult[];
  total: number;
}

export function registerSearch(server: McpServer, client: MeterClient) {
  server.tool(
    "search",
    "Search across all your meter.chat content — decisions, blueprints, debates, and conversations. Returns ranked results with snippets. Use this when you need to find relevant context across all your thinking.",
    {
      query: z.string().describe("Search query."),
      type: z
        .enum(["all", "decisions", "blueprints", "debates", "conversations"])
        .optional()
        .default("all")
        .describe("Filter by artifact type."),
      limit: z
        .number()
        .int()
        .positive()
        .optional()
        .default(10)
        .describe("Max results to return."),
    },
    async ({ query, type, limit }) => {
      const params = new URLSearchParams();
      params.set("q", query);
      if (type && type !== "all") params.set("type", type);
      params.set("limit", String(limit));

      const data = await client.get<SearchResponse>(
        `/v1/search?${params.toString()}`
      );

      if (data.results.length === 0) {
        return {
          content: [
            {
              type: "text" as const,
              text: `No results found for "${query}". Try different keywords.`,
            },
          ],
        };
      }

      const lines = [
        `**Search results for "${query}"** (${data.results.length} of ${data.total})`,
        "",
      ];

      for (const r of data.results) {
        const date = new Date(r.created_at).toLocaleDateString();
        const typeLabel = r.type.charAt(0).toUpperCase() + r.type.slice(1);
        lines.push(
          `**[${typeLabel}]** ${r.title} — ${date}`,
          `> ${r.snippet}`,
          `ID: ${r.id}`,
          ""
        );
      }

      lines.push(
        "Use `get_decision`, `get_blueprint`, or other tools with the ID to see full details."
      );

      return {
        content: [{ type: "text" as const, text: lines.join("\n") }],
      };
    }
  );
}
