import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { MeterClient } from "../client.js";

interface ProjectsResponse {
  projects: Array<{
    id: string;
    name: string;
    created_at: string;
    total_cost: number;
    total_requests: number;
    currency: string;
  }>;
}

export function registerGetProjects(server: McpServer, client: MeterClient) {
  server.tool(
    "get_projects",
    "List all projects and their usage summaries.",
    {},
    async () => {
      const data = await client.get<ProjectsResponse>("/v1/projects");

      if (data.projects.length === 0) {
        return {
          content: [
            {
              type: "text" as const,
              text: "No projects yet. Use the create_project tool to create one.",
            },
          ],
        };
      }

      const lines = [
        "**Projects:**",
        "| Name | ID | Requests | Total Cost |",
        "|------|----|----------|------------|",
      ];

      for (const p of data.projects) {
        lines.push(
          `| ${p.name} | ${p.id} | ${p.total_requests} | ${p.currency}${p.total_cost.toFixed(4)} |`
        );
      }

      return { content: [{ type: "text" as const, text: lines.join("\n") }] };
    }
  );
}
