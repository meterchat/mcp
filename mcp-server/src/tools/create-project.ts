import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { MeterClient } from "../client.js";

interface CreateProjectResponse {
  id: string;
  name: string;
  created_at: string;
}

export function registerCreateProject(server: McpServer, client: MeterClient) {
  server.tool(
    "create_project",
    "Create a new project for tracking usage.",
    {
      name: z.string().describe("Name for the new project."),
    },
    async ({ name }) => {
      const data = await client.post<CreateProjectResponse>("/v1/projects", {
        name,
      });

      return {
        content: [
          {
            type: "text" as const,
            text: `Project created.\n\n- **Name:** ${data.name}\n- **ID:** ${data.id}\n- **Created:** ${data.created_at}`,
          },
        ],
      };
    }
  );
}
