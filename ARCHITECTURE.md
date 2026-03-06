# Architecture

How the MCP server connects your IDE to meter.chat.

## System overview

```
┌─────────────────────────────────────────────────┐
│  Developer's Editor                              │
│  (Cursor / Claude Code / Codex / Windsurf)       │
│                                                  │
│  ┌──────────────────────────────────┐            │
│  │  Meter MCP Server (this repo)   │            │
│  │  - Runs locally via stdio       │            │
│  │  - Exposes tools + resources    │            │
│  │  - Authenticates with API key   │            │
│  └──────────────┬───────────────────┘            │
└─────────────────┼───────────────────────────────┘
                  │ HTTPS
                  ▼
┌─────────────────────────────────────────────────┐
│  Meter API (api.meter.chat)                      │
│  - Decisions                                     │
│  - Blueprints                                    │
│  - Debates                                       │
│  - Search                                        │
│  - User profile                                  │
└─────────────────────────────────────────────────┘
                  ▲
                  │ also used by
┌─────────────────────────────────────────────────┐
│  meter.chat (the consumer app)                   │
│  - AI chat with pay-per-thought billing          │
│  - Debate mode, decisions log, blueprints        │
│  - Where the thinking happens                    │
└─────────────────────────────────────────────────┘
```

The MCP server reads from the same API that powers meter.chat. It does not replace the consumer app — it extends it into the IDE. Users think on meter.chat, then their coding agent pulls that context while they build.

## MCP server

### What is MCP?

Model Context Protocol (MCP) is a standard for connecting AI agents to external tools and data sources. It defines a transport-agnostic protocol where servers expose **tools** (actions the agent can take) and **resources** (data the agent can read).

### Transport

The MCP server uses **stdio** transport. The editor spawns it as a child process and communicates over stdin/stdout. This means:

- No port management
- No network configuration
- Works behind firewalls and VPNs
- One server instance per editor session

### Tools

Tools are actions the agent can invoke. Each tool has a name, description, and JSON Schema for its parameters.

| Tool | Purpose |
|------|---------|
| `get_decisions` | List/search decisions from the decisions log |
| `get_decision` | Fetch full detail of a single decision |
| `get_blueprints` | List/search blueprints |
| `get_blueprint` | Fetch full content of a single blueprint |
| `get_debates` | List debate summaries with synthesis |
| `search` | Full-text search across all artifact types |
| `create_decision` | Record a new decision from IDE context |

6 read tools, 1 write tool. The server is read-heavy by design — the primary value is pulling thinking context into the IDE, not managing meter.chat from the IDE.

### Resources

Resources are data the agent can read without explicit tool invocation.

| Resource | URI | Purpose |
|----------|-----|---------|
| Recent decisions | `meter://decisions/recent` | Last 10 decisions for ambient context |
| Recent blueprints | `meter://blueprints/recent` | Last 10 blueprints for ambient context |
| Profile | `meter://profile` | User/workspace info and content counts |

### Data model

The MCP server works with three primary artifact types from meter.chat:

**Decision** — a structured record of a choice made during an AI conversation.
- title, context, options[], decision, rationale, tags[]
- linked to blueprints and conversations
- has a status (e.g., accepted, superseded, proposed)

**Blueprint** — an architectural plan or system design generated from conversation.
- title, content (markdown), tags[]
- linked to related decisions

**Debate** — a multi-model discussion on a topic.
- topic, participating models[], synthesis
- each model argues its perspective, then a synthesis is produced

### Authentication

The server reads the API key from the `METER_API_KEY` environment variable. The key is passed to the Meter API as a Bearer token on every request. Keys are generated from the meter.chat settings page.

### Error handling

- **No API key** → server exits with a message pointing to meter.chat/settings/api
- **Invalid API key** → tools return a clear "invalid key" message
- **Network failure** → tools return the error with a retry suggestion
- **Rate limit** → tools return the retry-after duration

## Directory structure

```
mcp-server/
├── src/
│   ├── index.ts              ← entry point, server setup
│   ├── tools/                ← tool implementations
│   │   ├── get-decisions.ts
│   │   ├── get-decision.ts
│   │   ├── get-blueprints.ts
│   │   ├── get-blueprint.ts
│   │   ├── get-debates.ts
│   │   ├── search.ts
│   │   └── create-decision.ts
│   ├── resources/            ← resource implementations
│   │   ├── recent-decisions.ts
│   │   ├── recent-blueprints.ts
│   │   └── profile.ts
│   └── client.ts             ← Meter API HTTP client
├── tsconfig.json
├── package.json
└── README.md
```

## Design principles

1. **Thin client** — the MCP server does not hold state. It's a pass-through to the API.
2. **Read-heavy** — the primary value is pulling thinking context into the IDE, not pushing data back.
3. **Fail clearly** — every error message tells the user what happened and what to do.
4. **Zero config** — one environment variable. No config files, no setup wizards.
5. **Editor-agnostic** — works with any MCP-compatible client via stdio.
