import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { MeterClient } from "../client.js";

interface BlueprintDetail {
  id: string;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  linked_decisions: Array<{ id: string; title: string }>;
}

export function registerGetBlueprint(server: McpServer, client: MeterClient) {
  server.tool(
    "get_blueprint",
    "Fetch the full content of a specific blueprint from meter.chat — the complete architectural document, specifications, and linked decisions.",
    {
      blueprint_id: z.string().describe("The blueprint ID."),
    },
    async ({ blueprint_id }) => {
      const bp = await client.get<BlueprintDetail>(
        `/v1/blueprints/${encodeURIComponent(blueprint_id)}`
      );

      const lines = [
        `# ${bp.title}`,
        "",
        `**Created:** ${new Date(bp.created_at).toLocaleDateString()}  `,
        `**Updated:** ${new Date(bp.updated_at).toLocaleDateString()}`,
      ];

      if (bp.tags.length > 0) {
        lines.push(`**Tags:** ${bp.tags.join(", ")}`);
      }

      lines.push("", "---", "", bp.content);

      if (bp.linked_decisions.length > 0) {
        lines.push("", "---", "", "## Linked decisions", "");
        for (const d of bp.linked_decisions) {
          lines.push(`- ${d.title} (ID: ${d.id})`);
        }
      }

      return {
        content: [{ type: "text" as const, text: lines.join("\n") }],
      };
    }
  );
}
