import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { MeterClient } from "../client.js";

interface CostEstimateResponse {
  model: string;
  estimated_cost: number;
  currency: string;
  input_cost: number;
  output_cost: number;
  price_per_million_input: number;
  price_per_million_output: number;
}

export function registerGetCostEstimate(
  server: McpServer,
  client: MeterClient
) {
  server.tool(
    "get_cost_estimate",
    "Estimate the cost of a model call before making it. Useful for expensive operations.",
    {
      model: z
        .string()
        .describe(
          'Model identifier (e.g., "claude-sonnet-4-20250514", "gpt-4o").'
        ),
      input_tokens: z.number().int().positive().describe("Estimated input tokens."),
      output_tokens: z
        .number()
        .int()
        .positive()
        .describe("Estimated output tokens."),
    },
    async ({ model, input_tokens, output_tokens }) => {
      const data = await client.post<CostEstimateResponse>(
        "/v1/estimate",
        { model, input_tokens, output_tokens }
      );

      return {
        content: [
          {
            type: "text" as const,
            text: [
              `**Cost estimate for ${data.model}:**`,
              `- Input: ${input_tokens.toLocaleString()} tokens → ${data.currency}${data.input_cost.toFixed(6)}`,
              `- Output: ${output_tokens.toLocaleString()} tokens → ${data.currency}${data.output_cost.toFixed(6)}`,
              `- **Total: ${data.currency}${data.estimated_cost.toFixed(6)}**`,
              "",
              `Pricing: ${data.currency}${data.price_per_million_input}/M input, ${data.currency}${data.price_per_million_output}/M output`,
            ].join("\n"),
          },
        ],
      };
    }
  );
}
