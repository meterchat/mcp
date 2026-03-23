<div align="center">

# Meter MCP Server

**Give your coding agent the context of everything you've thought, decided, and designed.**

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![MCP](https://img.shields.io/badge/MCP-compatible-7c3aed)](https://modelcontextprotocol.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)

[meter.chat](https://meter.chat) &bull; [Quick Start](#quick-start) &bull; [Tools](#tools) &bull; [API](#api) &bull; [Architecture](ARCHITECTURE.md)

</div>

---

## What is this?

[Meter](https://meter.chat) is a pay-per-thought AI workspace where you chat with every frontier model, run multi-model debates, log structured decisions, and generate architectural blueprints — all on a single postpaid tab.

This repo documents the **Meter MCP server** — a hosted HTTPS endpoint that connects your IDE's coding agent to your Meter thinking.

```
meter.chat  ──  think, debate, decide
    │
    ▼
https://meter.chat/api/mcp  ──  hosted MCP server
    ▲
    │ HTTPS
    │
Your Agent  ──  Cursor / Claude Code / Codex / Windsurf / Lovable / Replit
```

No install. No local server. One API key, one URL.

---

## Quick Start

### 1. Get your API key

Sign up at [meter.chat](https://meter.chat) and copy your key from **Settings → API**.

### 2. Connect your editor

<details open>
<summary><strong>Claude Code</strong></summary>

```bash
claude mcp add meter --transport http https://meter.chat/api/mcp -H "Authorization: Bearer your-api-key"
```

</details>

<details>
<summary><strong>Cursor</strong></summary>

Open **Settings → MCP Servers → Add Server**:

```json
{
  "mcpServers": {
    "meter": {
      "url": "https://meter.chat/api/mcp",
      "headers": {
        "Authorization": "Bearer your-api-key"
      }
    }
  }
}
```

</details>

<details>
<summary><strong>OpenAI Codex</strong></summary>

```json
{
  "mcpServers": {
    "meter": {
      "url": "https://meter.chat/api/mcp",
      "headers": {
        "Authorization": "Bearer your-api-key"
      }
    }
  }
}
```

</details>

<details>
<summary><strong>Windsurf</strong></summary>

```json
{
  "mcpServers": {
    "meter": {
      "url": "https://meter.chat/api/mcp",
      "headers": {
        "Authorization": "Bearer your-api-key"
      }
    }
  }
}
```

</details>

<details>
<summary><strong>Lovable</strong></summary>

```json
{
  "mcpServers": {
    "meter": {
      "url": "https://meter.chat/api/mcp",
      "headers": {
        "Authorization": "Bearer your-api-key"
      }
    }
  }
}
```

</details>

<details>
<summary><strong>Replit</strong></summary>

```json
{
  "mcpServers": {
    "meter": {
      "url": "https://meter.chat/api/mcp",
      "headers": {
        "Authorization": "Bearer your-api-key"
      }
    }
  }
}
```

</details>

<details>
<summary><strong>Antigravity</strong></summary>

```json
{
  "mcpServers": {
    "meter": {
      "url": "https://meter.chat/api/mcp",
      "headers": {
        "Authorization": "Bearer your-api-key"
      }
    }
  }
}
```

</details>

### 3. Start coding with context

Your agent can now pull your Meter thinking. Try:

- *"What did I decide about the auth system?"*
- *"Show me the blueprint for the API architecture"*
- *"Search my decisions for anything about database choice"*
- *"List my recent debates"*

---

## Tools

6 tools — all read-only. The MCP server pulls your thinking context into the IDE.

| Tool | Description |
|------|-------------|
| `get_decisions` | List and search your decision log. Filter by workspace or search term. |
| `get_decision` | Fetch full detail of a single decision — context, options, rationale. |
| `get_blueprints` | List and search your blueprints (artifacts). Filter by workspace. |
| `get_blueprint` | Fetch the full markdown content of a blueprint. |
| `get_debates` | Browse debate summaries with multi-model synthesis. |
| `search` | Full-text search across decisions, blueprints, and debates. |

---

## API

Your `mk_` API key works for both MCP and the Meter chat API.

### MCP endpoint

```
https://meter.chat/api/mcp
Authorization: Bearer mk_your_api_key
```

Used automatically by your IDE when configured above.

### Chat API

```
POST https://meter.chat/api/v1/chat
Authorization: Bearer mk_your_api_key
Content-Type: application/json

{
  "messages": [{"role": "user", "content": "Hello"}],
  "model": "anthropic/claude-sonnet-4.6"
}
```

Returns an SSE stream:

```
data: {"type":"delta","content":"Hi","tokensOut":1}
data: {"type":"usage","tokensIn":5,"tokensOut":50}
data: {"type":"done"}
```

Full API docs at [meter.chat/docs](https://meter.chat/docs).

---

## About Meter

[Meter](https://meter.chat) is the first pay-per-thought AI. Every frontier model — Claude, GPT, Gemini, Grok, DeepSeek — on a single postpaid tab. No subscriptions. No rate limits.

Three core primitives:

1. **Pay-per-thought routing** — Every model, one bill. Configurable spend limits. Automatic fallback across providers.
2. **Structured debates** — Pit models against each other in a 4-phase adversarial framework. Three models from three labs attack each other's logic.
3. **Agent Spec Kit** — Synthesize decisions and debates into artifacts your coding agent needs (`ARCHITECTURE.md`, `DECISIONS.md`, `CLAUDE.md`, `.cursorrules`), committed directly to GitHub.

This MCP server is the bridge. You think in Meter. Your agent codes with that context.

---

## Contributing

Contributions welcome. See [CLAUDE.md](CLAUDE.md) for AI agent instructions.

---

## License

[MIT](LICENSE)

---

<div align="center">

**Think in Meter. Pay per thought.**

[meter.chat](https://meter.chat)

</div>
