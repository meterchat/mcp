# CLAUDE.md

Instructions for AI agents working on this repository.

## What this repo is

This is the public-facing open-source repo for [Meter](https://meter.dev) — pay-per-thought AI for developers. It contains the MCP server that connects coding agents (Cursor, Claude Code, Codex, etc.) to the Meter platform.

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
- `src/client.ts` — HTTP client for the Meter API
- `src/tools/` — one file per MCP tool
- `src/resources/` — one file per MCP resource

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

## Environment

- `METER_API_KEY` — required for the MCP server to talk to the Meter API
- Node.js >= 18

## Testing

```bash
cd mcp-server
npm test
```

## Commit style

- Short, imperative messages: "add get-usage tool", "fix error handling in client"
- No conventional commit prefixes required
- One logical change per commit when possible
