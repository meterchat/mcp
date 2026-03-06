# CLAUDE.md

Instructions for AI agents working on this repository.

## What this repo is

This is the public-facing open-source repo for [meter.chat](https://meter.chat) — an AI chat app for builders with debate mode, decisions log, and blueprints. It contains the MCP server that lets coding agents (Cursor, Claude Code, Codex, etc.) access your meter.chat thinking artifacts from your IDE.

## Repository structure

- Root level: brand, docs, architectural context
- `mcp-server/`: the TypeScript MCP server package (the main code you'll work on)

## Working on the MCP server

```bash
cd mcp-server
npm install
npm run build
npm run dev    # runs with stdio, useful for testing with an MCP client
```

### Key files

- `src/index.ts` — server entry point, registers all tools and resources
- `src/client.ts` — HTTP client for the Meter API (api.meter.chat)
- `src/tools/` — one file per MCP tool (get-decisions, get-blueprints, search, etc.)
- `src/resources/` — one file per MCP resource (recent-decisions, recent-blueprints, profile)

### Adding a new tool

1. Create a new file in `src/tools/` following the existing pattern
2. Export a function that takes the MCP server instance and registers the tool
3. Import and call it from `src/index.ts`
4. Add the tool to the table in `ARCHITECTURE.md`

### Adding a new resource

Same pattern as tools, but in `src/resources/`.

## Code style

- TypeScript, strict mode
- No classes unless genuinely needed — prefer functions and plain objects
- Error messages should tell the user what happened and what to do about it
- No comments for obvious code. Comment the "why", not the "what"

## Domain context

The MCP server works with three artifact types from meter.chat:

- **Decisions** — structured records of choices (context, options, decision, rationale)
- **Blueprints** — architectural plans and system designs (markdown documents)
- **Debates** — multi-model discussions with a synthesized conclusion

The server is read-heavy by design. Most tools fetch data; only `create_decision` writes back.

## Environment

- `METER_API_KEY` — required for the MCP server to talk to api.meter.chat
- Node.js >= 18

## Testing

```bash
cd mcp-server
npm test
```

## Commit style

- Short, imperative messages: "add search tool", "fix error handling in client"
- No conventional commit prefixes required
- One logical change per commit when possible
