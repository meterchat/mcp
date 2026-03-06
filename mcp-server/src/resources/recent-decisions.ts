import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
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

export function registerRecentDecisionsResource(
  server: McpServer,
  client: MeterClient
) {
  server.resource(
    "recent-decisions",
    "meter://decisions/recent",
    async (uri) => {
      const data = await client.get<DecisionsResponse>(
        "/v1/decisions?limit=10&sort=recent"
      );

      const lines = ["**Recent Decisions**", ""];

      if (data.decisions.length === 0) {
        lines.push("No decisions yet. Start a conversation on meter.chat to record decisions.");
      } else {
        for (const d of data.decisions) {
          const date = new Date(d.created_at).toLocaleDateString();
          const tags = d.tags.length > 0 ? ` [${d.tags.join(", ")}]` : "";
          lines.push(`- **${d.title}** (${d.status}) — ${date}${tags}`);
          lines.push(`  ${d.summary}`);
          lines.push("");
        }
      }

      return {
        contents: [
          { uri: uri.href, mimeType: "text/markdown", text: lines.join("\n") },
        ],
      };
    }
  );
}
