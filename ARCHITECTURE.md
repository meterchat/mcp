# Architecture

How Meter's open-source components are built and how they connect to the platform.

## System overview

```
┌─────────────────────────────────────────────────┐
│  Developer's Editor                              │
│  (Cursor / Claude Code / Codex / Replit / etc.)  │
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
│  Meter API (api.meter.dev)                       │
│  - Usage tracking                                │
│  - Budget enforcement                            │
│  - Model routing                                 │
│  - Analytics                                     │
└──────────────────┬──────────────────────────────┘
                   │
         ┌─────────┼─────────┐
         ▼         ▼         ▼
     Anthropic   OpenAI   Google
      Claude      GPT     Gemini
```

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
| `get_usage` | Check current usage and costs for a project or time period |
| `get_balance` | Check remaining balance and budget status |
| `get_projects` | List projects and their usage summaries |
| `create_project` | Create a new project for usage tracking |
| `set_budget` | Set or update a budget limit on a project |
| `get_cost_estimate` | Estimate cost for a model call before making it |

### Resources

Resources are data the agent can read without taking an action.

| Resource | URI | Purpose |
|----------|-----|---------|
| Account info | `meter://account` | Current account details and plan |
| Pricing | `meter://pricing` | Current per-model pricing table |
| Usage summary | `meter://usage/summary` | High-level usage dashboard |

### Authentication

The server reads the API key from the `METER_API_KEY` environment variable. The key is passed to the Meter API as a Bearer token on every request. Keys are scoped per-account and can be rotated from the Meter dashboard.

### Error handling

- **No API key** → server starts but tools return an error prompting the user to set `METER_API_KEY`
- **Invalid API key** → tools return a clear "invalid key" message
- **Network failure** → tools return the error with a retry suggestion
- **Rate limit** → tools return the retry-after duration

## Directory structure

```
mcp-server/
├── src/
│   ├── index.ts          ← entry point, server setup
│   ├── tools/            ← tool implementations
│   │   ├── get-usage.ts
│   │   ├── get-balance.ts
│   │   ├── get-projects.ts
│   │   ├── create-project.ts
│   │   ├── set-budget.ts
│   │   └── get-cost-estimate.ts
│   ├── resources/        ← resource implementations
│   │   ├── account.ts
│   │   ├── pricing.ts
│   │   └── usage-summary.ts
│   └── client.ts         ← Meter API HTTP client
├── tsconfig.json
├── package.json
└── README.md
```

## Design principles

1. **Thin client** — the MCP server does not hold state. It's a pass-through to the API.
2. **Fail clearly** — every error message tells the user what happened and what to do.
3. **Zero config** — one environment variable. No config files, no setup wizards.
4. **Editor-agnostic** — works with any MCP-compatible client via stdio.
