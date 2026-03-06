import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { MeterClient } from "../client.js";

interface ProfileResponse {
  display_name: string;
  email: string;
  workspace: string;
  counts: {
    decisions: number;
    blueprints: number;
    debates: number;
    conversations: number;
  };
  created_at: string;
}

export function registerProfileResource(
  server: McpServer,
  client: MeterClient
) {
  server.resource("profile", "meter://profile", async (uri) => {
    const data = await client.get<ProfileResponse>("/v1/profile");

    const lines = [
      "**Meter Profile**",
      "",
      `**Name:** ${data.display_name}  `,
      `**Email:** ${data.email}  `,
      `**Workspace:** ${data.workspace}  `,
      `**Member since:** ${new Date(data.created_at).toLocaleDateString()}`,
      "",
      "**Content:**",
      `- ${data.counts.decisions} decisions`,
      `- ${data.counts.blueprints} blueprints`,
      `- ${data.counts.debates} debates`,
      `- ${data.counts.conversations} conversations`,
    ];

    return {
      contents: [
        { uri: uri.href, mimeType: "text/markdown", text: lines.join("\n") },
      ],
    };
  });
}
