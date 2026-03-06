# Meter

**Think with AI. Pay per thought.**

[meter.chat](https://meter.chat) is an AI chat app for builders. You chat with AI, run multi-model debates, record structured decisions, and generate architectural blueprints — all on a pay-per-thought basis. No subscriptions. No tiers. Just thinking.

## What makes Meter different

- **Debate mode** — pit models against each other on a topic and get a synthesis
- **Decisions log** — structured records of every choice: context, options, rationale
- **Blueprints** — architectural plans and system designs born from conversation
- **Pay-per-thought** — no monthly fee, pay only for what you use

## The MCP server

This repo contains the open-source **MCP server** that bridges your meter.chat thinking into your coding workflow.

You do your thinking on meter.chat — weighing options, debating approaches, documenting architecture. Then you switch to your IDE. Without this server, that context is gone. Your coding agent doesn't know what you decided or why.

The MCP server fixes that. Install it in Cursor, Claude Code, Codex, or any MCP-compatible tool, and your agent can access your decisions, blueprints, and debate history while you code.

```
meter.chat (your thinking)
     ↓ stored
Meter API (api.meter.chat)
     ↑ fetched by
Meter MCP Server (this repo, runs in your IDE)
     ↑ used by
Your coding agent (Cursor / Claude Code / Codex)
```

## Quick start

### 1. Sign up at [meter.chat](https://meter.chat) and grab your API key

### 2. Add to your editor

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

See the [MCP server README](./mcp-server/README.md) for editor-specific instructions.

### 3. Code with context

Your agent can now pull your decisions, blueprints, and debates. Ask it "what did I decide about the auth system?" and it'll check your meter.chat history.

## Repository structure

```
meter/
├── README.md            ← you are here
├── ARCHITECTURE.md      ← system design and technical decisions
├── DECISIONS.md         ← why we built it this way
├── CLAUDE.md            ← instructions for AI agents working on this repo
├── LICENSE              ← MIT
└── mcp-server/          ← the open-source MCP server
    ├── README.md        ← setup instructions for every supported editor
    ├── src/             ← TypeScript source
    └── package.json
```

## Philosophy

Your thinking should follow you into your code. Decisions made in conversation should be available when implementing. The IDE should know what you already figured out.

We build in public. Our architecture decisions, our thinking, our trade-offs — all in this repo.

## Open source

The MCP server is MIT-licensed. It is the bridge between your IDE and meter.chat. We open-source the connector, not the platform, because the connector is more useful in your hands than ours.

Contributions welcome. Add a tool, improve a resource, support a new editor. See [CLAUDE.md](./CLAUDE.md) for how to work on this repo.

## Links

- [meter.chat](https://meter.chat) — the product
- [MCP server docs](./mcp-server/README.md) — get set up
- [Architecture](./ARCHITECTURE.md) — how it's built
- [Decisions](./DECISIONS.md) — why it's built this way

---

Made by the Meter team. Think with AI. Pay per thought.
