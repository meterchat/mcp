# Meter

**Pay-per-thought AI for developers.**

Meter is the billing layer between you and AI. One account, one balance, every model — pay only for what you think.

## The problem

AI billing is fragmented. You have an OpenAI key, an Anthropic key, a Google key. Each with its own dashboard, its own credits, its own pricing page you check at 2am. You're managing vendor accounts instead of building.

## What Meter does

Meter sits between your tools and the models. You top up once. Your tools draw from one balance. You see exactly what each thought costs, in real time, across every provider.

- **One API key** → routes to any model (Claude, GPT, Gemini, Llama, and more)
- **Real-time metering** → see cost per request, per session, per project
- **Budget controls** → set limits per project, per team, per day
- **Usage analytics** → understand where your AI spend goes

## How it works

```
Your Editor (Cursor, Claude Code, Codex, etc.)
        ↓
   Meter MCP Server (this repo)
        ↓
   Meter API (meter.dev)
        ↓
   AI Providers (Anthropic, OpenAI, Google, etc.)
```

You install the MCP server. It connects your coding agent to Meter. Every AI call flows through your Meter account. You see everything.

## Quick start

### 1. Get a Meter account

Sign up at [meter.dev](https://meter.dev) and grab your API key.

### 2. Install the MCP server

```bash
npx @anthropic-ai/meter-mcp-server
```

Or see the [MCP server README](./mcp-server/README.md) for detailed setup with Cursor, Claude Code, Codex, and others.

### 3. Build

That's it. Your agent is now metered.

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

We believe AI costs should be **transparent**, **controllable**, and **simple**. One key, one bill, full visibility. No surprise invoices. No hunting through dashboards.

We build in public. Our architecture decisions, our thinking, our trade-offs — all in this repo. Git is for thinking, not just code.

## Open source

The MCP server is MIT-licensed. It is the bridge between your tools and Meter. We open-source the connector, not the platform, because the connector is more useful in your hands than ours.

Contributions welcome. Add a tool, improve a prompt, support a new editor. See [CLAUDE.md](./CLAUDE.md) for how to work on this repo.

## Links

- [meter.dev](https://meter.dev) — the product
- [MCP server docs](./mcp-server/README.md) — get set up
- [Architecture](./ARCHITECTURE.md) — how it's built
- [Decisions](./DECISIONS.md) — why it's built this way

---

Made by the Meter team. Pay for what you think.
