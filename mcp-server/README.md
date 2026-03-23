# Meter MCP Server — Reference Implementation

> **Note:** The production MCP server runs at `https://meter.chat/api/mcp` as a hosted HTTPS endpoint. You do not need to run this code locally to use the MCP server.
>
> See the [root README](../README.md) for setup instructions.

This directory contains a standalone reference implementation of the Meter MCP server using stdio transport. It demonstrates how the MCP tools work and can be used for local development and testing.

## Tools implemented

| Tool | Description |
|------|-------------|
| `get_decisions` | List and search your decisions log |
| `get_decision` | Fetch full detail of a single decision |
| `get_blueprints` | List and search your blueprints |
| `get_blueprint` | Fetch full content of a blueprint |
| `get_debates` | List debate summaries with synthesis |
| `search` | Full-text search across all artifact types |
| `create_decision` | Record a new decision (reference only — not in production MCP) |

## Local development

```bash
npm install
npm run build
METER_API_KEY="mk_your-key" npm start
```

This starts a stdio-based MCP server that proxies requests to `https://api.meter.chat`.

## License

[MIT](../LICENSE)
