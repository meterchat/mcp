# Decisions

A log of architectural and product decisions, with context. We write these down so future us (and contributors) understand why things are the way they are.

---

## 001 — Open-source the MCP server, not the platform

**Date:** 2026-03-05
**Status:** Accepted

### Context

We need developers to connect their coding agents to Meter. The MCP server is the bridge. We could keep it closed-source and distribute it as a binary, or open-source it.

### Decision

Open-source the MCP server under MIT. Keep the core platform (API, billing engine, dashboard) private.

### Why

- The MCP server is small, self-contained, and useful on its own
- It shows developers exactly how to connect to Meter — trust through transparency
- Someone cannot clone Meter from the MCP server code alone
- It invites contribution — developers can add tools and resources without touching our main codebase
- Every MCP server install is a funnel to the product (you need a Meter account for it to work)

We are open-sourcing the connector, not the product. That is the right boundary.

---

## 002 — TypeScript for the MCP server

**Date:** 2026-03-05
**Status:** Accepted

### Context

The MCP server needs a language. Our options: TypeScript, Python, Go, Rust.

### Decision

TypeScript.

### Why

- The MCP SDK (`@modelcontextprotocol/sdk`) has first-class TypeScript support
- Most MCP server examples and documentation are in TypeScript
- `npx` distribution means zero install friction — one command, it runs
- The developer audience (Cursor, Claude Code, Codex users) skews heavily TypeScript
- JSON Schema for tool parameters is native to the ecosystem

---

## 003 — stdio transport only (for now)

**Date:** 2026-03-05
**Status:** Accepted

### Context

MCP supports multiple transports: stdio, SSE (Server-Sent Events), and streamable HTTP. We need to pick which to support.

### Decision

stdio only at launch.

### Why

- Every major MCP client (Cursor, Claude Code, Codex) supports stdio
- stdio means no port conflicts, no firewall issues, no network config
- One process per editor session — simple lifecycle management
- We can add SSE/HTTP later if there's demand for remote or shared server scenarios
- Simplest possible implementation for v1

---

## 004 — Environment variable for auth, nothing else

**Date:** 2026-03-05
**Status:** Accepted

### Context

The server needs to authenticate with the Meter API. We could use config files, OAuth flows, interactive login, or environment variables.

### Decision

Single environment variable: `METER_API_KEY`.

### Why

- Every editor's MCP config already supports setting env vars
- No config files to manage, find, or accidentally commit
- Consistent with how developers already manage API keys (OpenAI, Anthropic, etc.)
- The server should start in < 1 second — no interactive auth flows
- We can add OAuth or `meter login` later as a convenience layer, not a requirement

---

## 005 — Stateless server design

**Date:** 2026-03-05
**Status:** Accepted

### Context

The MCP server could cache data locally, maintain session state, or be a pure pass-through to the API.

### Decision

Pure pass-through. No local state, no caching.

### Why

- Simpler to reason about — the server is a translation layer, not a data store
- No stale data issues — every tool call hits the API for fresh data
- No persistence to manage — no SQLite, no files, no cleanup
- If the API is down, the server fails clearly instead of returning stale data
- We can add caching later if latency becomes an issue (it won't for billing queries)

---

## 006 — Monorepo with MCP server as subdirectory

**Date:** 2026-03-05
**Status:** Accepted

### Context

We could have a separate repo for the MCP server or keep it in the main public repo.

### Decision

Single repo. MCP server lives at `mcp-server/`.

### Why

- The public repo is the storefront — README, architecture, decisions all live together
- The MCP server is the only open-source component right now, but more may follow
- One repo means one place for issues, one place for PRs
- The root-level docs provide context that makes the MCP server code more understandable
- If we add a Python SDK, CLI tool, or other connectors later, they slot in as sibling directories
