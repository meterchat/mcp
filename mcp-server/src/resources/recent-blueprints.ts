import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
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

export function registerRecentBlueprintsResource(
  server: McpServer,
  client: MeterClient
) {
  server.resource(
    "recent-blueprints",
    "meter://blueprints/recent",
    async (uri) => {
      const data = await client.get<BlueprintsResponse>(
        "/v1/blueprints?limit=10&sort=recent"
      );

      const lines = ["**Recent Blueprints**", ""];

      if (data.blueprints.length === 0) {
        lines.push("No blueprints yet. Create blueprints on meter.chat to see them here.");
      } else {
        for (const bp of data.blueprints) {
          const date = new Date(bp.created_at).toLocaleDateString();
          const tags = bp.tags.length > 0 ? ` [${bp.tags.join(", ")}]` : "";
          lines.push(`- **${bp.title}** — ${date}${tags}`);
          lines.push(`  ${bp.summary}`);
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
