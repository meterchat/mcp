# Architecture

How the Meter MCP server connects your IDE to your meter.chat thinking.

## System overview

```
┌─────────────────────────────────────────────────┐
│  Developer's Editor                              │
│  (Cursor / Claude Code / Codex / Windsurf)       │
│                                                  │
│  Agent sends MCP requests over HTTPS             │
│                                                  │
└─────────────────┬───────────────────────────────┘
                  │ HTTPS
                  │ Authorization: Bearer mk_...
                  ▼
┌─────────────────────────────────────────────────┐
│  Meter MCP Server                                │
│  https://meter.chat/api/mcp                      │
│                                                  │
│  - Hosted on meter.chat (Next.js API route)      │
│  - Streamable HTTP transport                     │
│  - Authenticates via mk_ API keys                │
│  - Queries Supabase directly                     │
│  - 6 read-only tools                             │
└─────────────────────────────────────────────────┘
                  │
                  │ reads from
                  ▼
┌─────────────────────────────────────────────────┐
│  Supabase (PostgreSQL)                           │
│  - decisions table                               │
│  - artifacts table (blueprints)                  │
│  - chat_sessions table (debates)                 │
│  - mcp_keys table (auth)                         │
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

The MCP server is a hosted endpoint on meter.chat. It reads from the same database that powers the consumer app. It does not replace the app — it extends it into the IDE.

## Transport

The MCP server uses **Streamable HTTP** transport via the MCP SDK's `WebStandardStreamableHTTPServerTransport`. It runs as a Next.js API route at `/api/mcp`.

- Handles `POST`, `GET`, and `DELETE` HTTP methods
- No local server to install or run
- Works with any MCP client that supports HTTP transport
- One URL for all editors: `https://meter.chat/api/mcp`

## Authentication

API keys are generated from **Settings → API** on meter.chat.

- Keys are prefixed with `mk_` (e.g., `mk_abc123...`)
- Passed as `Authorization: Bearer mk_...` header
- Keys are SHA-256 hashed before storage in the `mcp_keys` table
- Only one active key per user at a time
- `last_used_at` is tracked on each request
- Invalid or missing key returns 401 Unauthorized

The same `mk_` key also works for the chat API (`POST /api/v1/chat`).

## Tools

6 read-only tools. The server is read-only by design — the primary value is pulling thinking context into the IDE, not managing meter.chat from the IDE.

| Tool | Description | Parameters |
|------|-------------|------------|
| `get_decisions` | List/search decisions from the decisions log | `session_id?`, `query?` |
| `get_decision` | Fetch full detail of a single decision | `id` |
| `get_blueprints` | List/search blueprints (artifacts) | `session_id?` |
| `get_blueprint` | Fetch full content of a single blueprint | `id` |
| `get_debates` | List debate summaries | `limit?` (default 20) |
| `search` | Full-text search across decisions, blueprints, and debates | `query` |

All tools query Supabase directly, scoped to the authenticated user via `user_id`.

## Data model

The MCP server works with three artifact types from meter.chat:

**Decision** — a structured record of a choice made during an AI conversation.
- title, status, choice, reasoning, category
- versioned (version number, revisit count)
- scoped to a workspace (session_id)

**Blueprint** — an architectural plan or artifact generated from conversation.
- file_path, content (markdown), status, category
- categories: readme, architecture, design, decisions, claude, cursorrules

**Debate** — a multi-model discussion session.
- workspace_name, project_name
- contains chat messages with debate traces

## Error handling

- **No API key / invalid key** → 401 Unauthorized JSON response
- **Supabase query error** → tool returns error message in content
- **All errors** are returned as MCP text content, not transport-level failures

## Design principles

1. **Hosted, not local** — no install, no build, no local process. One URL.
2. **Read-only** — the primary value is pulling thinking context into the IDE.
3. **Zero config** — one API key, one URL. No config files.
4. **Editor-agnostic** — works with any MCP client that supports HTTP transport.
5. **Same database** — queries the same Supabase instance as meter.chat, so context is always fresh.
