<div align="center">

# Meter MCP Server

**Bridge your AI thinking into your coding workflow.**

[![npm version](https://img.shields.io/npm/v/@meter/mcp-server?color=cb3837&label=npm&logo=npm&logoColor=white)](https://www.npmjs.com/package/@meter/mcp-server)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![MCP](https://img.shields.io/badge/MCP-compatible-7c3aed?logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+)](https://modelcontextprotocol.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)

[meter.chat](https://meter.chat) &bull; [Quick Start](#quick-start) &bull; [Tools](#tools) &bull; [Resources](#resources) &bull; [Architecture](ARCHITECTURE.md)

</div>

---

## What is this?

[Meter](https://meter.chat) is a pay-per-thought AI workspace where you chat with every frontier model, run multi-model debates, log structured decisions, and generate architectural blueprints — all on a single postpaid tab.

This repo contains the **MCP server** that makes your Meter thinking available inside your IDE. Install it in Cursor, Claude Code, Codex, or Windsurf, and your coding agent gets access to your decisions, blueprints, and debate history while you build.

```
meter.chat  ──  think, debate, decide
    │
    ▼
Meter API  ──  stores your decisions, blueprints, debates
    ▲
    │
MCP Server  ──  this repo, runs locally in your editor
    ▲
    │
Your Agent  ──  Cursor / Claude Code / Codex / Windsurf
```

> **Think in Meter. Code with context.**

---

## Quick Start

### 1. Get your API key

Sign up at [meter.chat](https://meter.chat) and copy your key from **Settings → API**.

### 2. Add to your editor

<details>
<summary><strong>Cursor</strong></summary>

Open **Settings → MCP Servers → Add Server**:

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

</details>

<details>
<summary><strong>Claude Code</strong></summary>

```bash
claude mcp add meter -- npx -y @meter/mcp-server
```

Set your API key:

```bash
export METER_API_KEY="your-api-key"
```

Or add to `~/.claude/claude_desktop_config.json`:

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

</details>

<details>
<summary><strong>OpenAI Codex</strong></summary>

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

</details>

<details>
<summary><strong>Windsurf</strong></summary>

Open **Settings → MCP → Add Server** with the same JSON config as Cursor.

</details>

<details>
<summary><strong>Any MCP-compatible client</strong></summary>

The server uses **stdio** transport. Spawn it as a child process:

```bash
METER_API_KEY="your-api-key" npx @meter/mcp-server
```

</details>

### 3. Start coding with context

Your agent can now pull your Meter thinking. Try asking:

- *"What did I decide about the auth system?"*
- *"Show me the blueprint for the API architecture"*
- *"Search my decisions for anything about database choice"*
- *"Record a decision: we're using Postgres because..."*

---

## Tools

7 tools — 6 read, 1 write. Read-heavy by design: the primary value is pulling thinking context into the IDE.

| Tool | Description |
|------|-------------|
| `get_decisions` | List and search your decisions log |
| `get_decision` | Fetch full detail of a single decision (context, options, rationale) |
| `get_blueprints` | List and search your architectural blueprints |
| `get_blueprint` | Fetch the full markdown content of a blueprint |
| `get_debates` | List debate summaries with multi-model synthesis |
| `search` | Full-text search across all artifact types |
| `create_decision` | Record a new decision from your IDE |

## Resources

Ambient context your agent can read automatically.

| Resource | URI | Description |
|----------|-----|-------------|
| Recent decisions | `meter://decisions/recent` | Last 10 decisions |
| Recent blueprints | `meter://blueprints/recent` | Last 10 blueprints |
| Profile | `meter://profile` | Account info and content counts |

---

## How it works

The MCP server is a thin, stateless client. It reads from the same API that powers [meter.chat](https://meter.chat) — it doesn't replace the app, it extends it into the IDE.

- **Transport:** stdio (spawned as a child process by your editor)
- **Auth:** Bearer token via `METER_API_KEY` environment variable
- **State:** None. Every request hits the Meter API directly.
- **Errors:** Clear messages — invalid key, rate limit with retry-after, network failures with suggestions

See [ARCHITECTURE.md](ARCHITECTURE.md) for the full system design.

---

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `METER_API_KEY` | Yes | Your API key from [meter.chat/settings](https://meter.chat/settings/api) |
| `METER_API_URL` | No | Override API base URL (default: `https://api.meter.chat`) |

---

## Development

```bash
git clone https://github.com/meterchat/mcp.git
cd mcp/mcp-server
npm install
npm run build
```

Run locally:

```bash
METER_API_KEY="your-key" npm start
```

Type-check:

```bash
npm run typecheck
```

### Project structure

```
mcp-server/
├── src/
│   ├── index.ts           ← Entry point, server setup
│   ├── client.ts          ← Meter API HTTP client
│   ├── tools/             ← Tool implementations
│   │   ├── get-decisions.ts
│   │   ├── get-decision.ts
│   │   ├── get-blueprints.ts
│   │   ├── get-blueprint.ts
│   │   ├── get-debates.ts
│   │   ├── search.ts
│   │   └── create-decision.ts
│   └── resources/         ← Resource implementations
│       ├── recent-decisions.ts
│       ├── recent-blueprints.ts
│       └── profile.ts
├── package.json
└── tsconfig.json
```

---

## Contributing

Contributions welcome. Some ideas:

- Add a new tool (e.g., `create_blueprint`, `update_decision`)
- Improve error messages or retry logic
- Add editor-specific setup guides
- Write tests

See [CLAUDE.md](CLAUDE.md) for AI agent instructions if you're contributing with Claude Code or Cursor.

---

## About Meter

[Meter](https://meter.chat) is the first pay-per-thought AI. Every frontier model — Claude, GPT, Gemini, Grok, DeepSeek — on a single postpaid tab. No subscriptions. No rate limits. Multi-tier routing across providers.

Three core primitives:

1. **Pay-per-thought routing** — Every model, one bill. Configurable spend limits. Automatic fallback across providers.
2. **Structured debates** — Pit models against each other in a 4-phase adversarial framework. Three models from three labs attack each other's logic.
3. **Agent Spec Kit** — Synthesize decisions and debates into artifacts your coding agent needs (`ARCHITECTURE.md`, `DECISIONS.md`, `CLAUDE.md`, `.cursorrules`), committed directly to GitHub.

This MCP server is the bridge. You think in Meter. Your agent codes with that context.

---

## License

[MIT](LICENSE)

---

<div align="center">

**Think in Meter. Pay per thought.**

[meter.chat](https://meter.chat)

</div>
