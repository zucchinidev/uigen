# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run setup        # Install deps, generate Prisma client, run migrations
npm run dev          # Start dev server with Turbopack (http://localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Run all tests with Vitest
npx vitest run src/path/to/test.ts  # Run a single test file
npm run db:reset     # Reset database (destructive)
```

## Architecture Overview

UIGen is an AI-powered React component generator with live preview. Users describe components in chat, Claude generates
code, and a live preview renders the result in real-time.

### Core Data Flow

1. **Chat API** (`src/app/api/chat/route.ts`): Receives messages, passes VirtualFileSystem to AI tools, streams
   responses via Vercel AI SDK
2. **AI Tools**: Claude uses `str_replace_editor` (create/edit files) and `file_manager` (rename/delete) tools to modify
   the virtual filesystem
3. **FileSystemContext** (`src/lib/contexts/file-system-context.tsx`): Client-side context that processes tool calls and
   triggers UI updates
4. **ChatContext** (`src/lib/contexts/chat-context.tsx`): Wraps Vercel AI SDK's useChat, connects to FileSystemContext
   for tool call handling
5. **PreviewFrame** (`src/components/preview/PreviewFrame.tsx`): Renders generated components in sandboxed iframe using
   import maps

### Virtual File System

The `VirtualFileSystem` class (`src/lib/file-system.ts`) maintains an in-memory tree structure. Files never touch disk
during generation. The system:

- Serializes to JSON for persistence in the database
- Supports `@/` path aliases (maps to root `/`)
- Auto-creates parent directories

### JSX Transformation Pipeline

`src/lib/transform/jsx-transformer.ts` handles the preview:

1. Transforms JSX/TSX files with Babel standalone
2. Creates blob URLs for each transformed module
3. Builds import maps with esm.sh for third-party packages
4. CSS files are collected and injected as `<style>` tags

### Database

SQLite via Prisma. Prisma client generates to `src/generated/prisma/`.

Reference `prisma/schema.prisma` anytime you need to understand the data structure stored in the database.

### Key Patterns

- **Server Components**: `src/app/page.tsx` and `src/app/[projectId]/page.tsx` are async server components
- **Path Alias**: All local imports use `@/` which maps to `./src/*`
- **Tool Structure**: AI tools in `src/lib/tools/` return result objects for the AI to interpret

## Code Style

- Use comments sparingly. Only comment complex code.

## Commits

- Use conventional commits based on domain (e.g., `feat(auth):`, `fix(preview):`, `refactor(file-system):`)
- Never mention Claude Code or authors in commit messages

## GitHub Actions Environment

When running in GitHub Actions (via claude-code-action):

- The project is already set up with all dependencies installed
- The dev server is running at `localhost:3000`
- Server logs are written to `logs.txt` (use `cat logs.txt` or `tail logs.txt` to view)
- Use `sqlite3` CLI to query the database if needed
- Use Playwright MCP tools (`mcp__playwright__*`) to launch a browser and interact with the app
