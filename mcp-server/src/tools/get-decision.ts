import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { MeterClient } from "../client.js";

interface DecisionDetail {
  id: string;
  title: string;
  status: string;
  context: string;
  options: Array<{ name: string; description: string }>;
  decision: string;
  rationale: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  linked_blueprints: Array<{ id: string; title: string }>;
  linked_conversations: Array<{ id: string; title: string }>;
}

export function registerGetDecision(server: McpServer, client: MeterClient) {
  server.tool(
    "get_decision",
    "Fetch the full content of a specific decision from meter.chat, including context, options considered, rationale, and any linked conversations or blueprints.",
    {
      decision_id: z.string().describe("The decision ID."),
    },
    async ({ decision_id }) => {
      const d = await client.get<DecisionDetail>(
        `/v1/decisions/${encodeURIComponent(decision_id)}`
      );

      const lines = [
        `# ${d.title}`,
        "",
        `**Status:** ${d.status}  `,
        `**Created:** ${new Date(d.created_at).toLocaleDateString()}  `,
        `**Updated:** ${new Date(d.updated_at).toLocaleDateString()}`,
      ];

      if (d.tags.length > 0) {
        lines.push(`**Tags:** ${d.tags.join(", ")}`);
      }

      lines.push("", "## Context", "", d.context);

      if (d.options.length > 0) {
        lines.push("", "## Options considered", "");
        for (const opt of d.options) {
          lines.push(`- **${opt.name}:** ${opt.description}`);
        }
      }

      lines.push("", "## Decision", "", d.decision);
      lines.push("", "## Rationale", "", d.rationale);

      if (d.linked_blueprints.length > 0) {
        lines.push("", "## Linked blueprints", "");
        for (const bp of d.linked_blueprints) {
          lines.push(`- ${bp.title} (ID: ${bp.id})`);
        }
      }

      if (d.linked_conversations.length > 0) {
        lines.push("", "## Linked conversations", "");
        for (const conv of d.linked_conversations) {
          lines.push(`- ${conv.title} (ID: ${conv.id})`);
        }
      }

      return {
        content: [{ type: "text" as const, text: lines.join("\n") }],
      };
    }
  );
}
