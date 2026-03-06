import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { MeterClient } from "../client.js";

interface CreateDecisionResponse {
  id: string;
  title: string;
  url: string;
  created_at: string;
}

export function registerCreateDecision(
  server: McpServer,
  client: MeterClient
) {
  server.tool(
    "create_decision",
    "Create a new decision in your meter.chat decisions log from your current coding context. Use this when you've just made an architectural or implementation decision and want to record it alongside your other thinking.",
    {
      title: z.string().describe("Short decision title."),
      context: z
        .string()
        .describe(
          "The problem or situation that prompted this decision."
        ),
      decision: z.string().describe("What was decided."),
      rationale: z.string().describe("Why this option was chosen."),
      options: z
        .array(z.string())
        .optional()
        .describe("Options that were considered."),
      tags: z
        .array(z.string())
        .optional()
        .describe("Tags for categorization."),
    },
    async ({ title, context, decision, rationale, options, tags }) => {
      const body: Record<string, unknown> = {
        title,
        context,
        decision,
        rationale,
      };
      if (options) body.options = options;
      if (tags) body.tags = tags;

      const data = await client.post<CreateDecisionResponse>(
        "/v1/decisions",
        body
      );

      return {
        content: [
          {
            type: "text" as const,
            text: [
              `Decision recorded: **${data.title}**`,
              `ID: ${data.id}`,
              `View on meter.chat: ${data.url}`,
            ].join("\n"),
          },
        ],
      };
    }
  );
}
