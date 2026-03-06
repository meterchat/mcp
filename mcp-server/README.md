# Meter MCP Server

Access your [meter.chat](https://meter.chat) decisions, blueprints, and debates from your IDE.

Works with Cursor, Claude Code, Codex, Windsurf, and any MCP-compatible tool.

## Setup

### 1. Get your API key

Sign up at [meter.chat](https://meter.chat) and copy your API key from Settings → API.

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

#### Any MCP client

The server uses stdio transport. Spawn it as a child process:

```bash
METER_API_KEY="your-api-key" npx @meter/mcp-server
```

## Tools

| Tool | What it does |
|------|-------------|
| `get_decisions` | List/search your decisions log |
| `get_decision` | Fetch full detail of a single decision |
| `get_blueprints` | List/search your blueprints |
| `get_blueprint` | Fetch full content of a blueprint |
| `get_debates` | List debate summaries with synthesis |
| `search` | Full-text search across all artifact types |
| `create_decision` | Record a new decision from your IDE |

## Resources

| Resource | URI | What it provides |
|----------|-----|-----------------|
| Recent decisions | `meter://decisions/recent` | Last 10 decisions for ambient context |
| Recent blueprints | `meter://blueprints/recent` | Last 10 blueprints for ambient context |
| Profile | `meter://profile` | Account info and content counts |

## Example usage

Once installed, ask your coding agent things like:

- "What did I decide about the auth system?"
- "Show me the blueprint for the API architecture"
- "Search my meter.chat for anything about database schema"
- "Record a decision: we're using PostgreSQL for the user store because..."

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `METER_API_KEY` | Yes | Your meter.chat API key |
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
