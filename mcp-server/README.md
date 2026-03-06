# Meter MCP Server

Connect your coding agent to [Meter](https://meter.dev) — pay-per-thought AI billing.

Works with Cursor, Claude Code, Codex, Windsurf, and any MCP-compatible tool.

## Setup

### 1. Get your API key

Sign up at [meter.dev](https://meter.dev) and copy your API key from the dashboard.

### 2. Configure your editor

#### Cursor

Open Settings → MCP Servers → Add Server:

```json
{
  "mcpServers": {
    "meter": {
      "command": "npx",
      "args": ["-y", "@meter/mcp-server"],
      "env": {
        "METER_API_KEY": "your-api-key"
      }
    }
  }
}
```

#### Claude Code

Run:

```bash
claude mcp add meter -- npx -y @meter/mcp-server
```

Then set your API key in your environment:

```bash
export METER_API_KEY="your-api-key"
```

Or add to your Claude Code MCP config (`~/.claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "meter": {
      "command": "npx",
      "args": ["-y", "@meter/mcp-server"],
      "env": {
        "METER_API_KEY": "your-api-key"
      }
    }
  }
}
```

#### OpenAI Codex

Add to your Codex MCP configuration:

```json
{
  "mcpServers": {
    "meter": {
      "command": "npx",
      "args": ["-y", "@meter/mcp-server"],
      "env": {
        "METER_API_KEY": "your-api-key"
      }
    }
  }
}
```

#### Windsurf

Open Settings → MCP → Add Server with the same JSON config as Cursor above.

#### Replit

Add to your `.replit` MCP configuration:

```json
{
  "mcpServers": {
    "meter": {
      "command": "npx",
      "args": ["-y", "@meter/mcp-server"],
      "env": {
        "METER_API_KEY": "your-api-key"
      }
    }
  }
}
```

#### Any MCP client

The server uses stdio transport. Spawn it as a child process:

```bash
METER_API_KEY="your-api-key" npx @meter/mcp-server
```

## Tools

| Tool | What it does |
|------|-------------|
| `get_usage` | Check usage and costs, broken down by model |
| `get_balance` | Check remaining balance and budget status |
| `get_projects` | List all projects with usage summaries |
| `create_project` | Create a new project for tracking |
| `set_budget` | Set a spending limit on a project |
| `get_cost_estimate` | Estimate cost before making a model call |

## Resources

| Resource | URI | What it provides |
|----------|-----|-----------------|
| Account | `meter://account` | Account details and plan |
| Pricing | `meter://pricing` | Per-model pricing table |
| Usage summary | `meter://usage/summary` | Dashboard-style usage overview |

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `METER_API_KEY` | Yes | Your Meter API key |
| `METER_API_URL` | No | Override API base URL (for development) |

## Development

```bash
git clone https://github.com/meterxyz/meter.git
cd meter/mcp-server
npm install
npm run build
```

To test locally with an MCP client:

```bash
METER_API_KEY="your-key" npm start
```

## License

MIT
