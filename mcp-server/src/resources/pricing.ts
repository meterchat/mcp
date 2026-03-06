import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { MeterClient } from "../client.js";

interface PricingResponse {
  currency: string;
  models: Array<{
    id: string;
    provider: string;
    price_per_million_input: number;
    price_per_million_output: number;
  }>;
}

export function registerPricingResource(
  server: McpServer,
  client: MeterClient
) {
  server.resource("pricing", "meter://pricing", async (uri) => {
    const data = await client.get<PricingResponse>("/v1/pricing");

    const lines = [
      "**Meter Pricing (per million tokens)**",
      "",
      "| Model | Provider | Input | Output |",
      "|-------|----------|-------|--------|",
    ];

    for (const m of data.models) {
      lines.push(
        `| ${m.id} | ${m.provider} | ${data.currency}${m.price_per_million_input.toFixed(2)} | ${data.currency}${m.price_per_million_output.toFixed(2)} |`
      );
    }

    return {
      contents: [
        { uri: uri.href, mimeType: "text/markdown", text: lines.join("\n") },
      ],
    };
  });
}
