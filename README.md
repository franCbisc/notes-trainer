# notes-trainer

A small React + TypeScript app for practising musical note reading.

## Overview

This project provides an interactive quiz UI to learn note positions on the staff. It is organized using a feature-based structure (features contain components, hooks, and types).

## Quick Start

Prerequisites: Node 18+ and npm or pnpm.

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## What’s Included

- `src/main.tsx` — app entry
- `src/features/noteReader` — feature folder with page, components, hooks, and types
- Config: `package.json`, `tsconfig*.json`, `vite.config.*`

## Project Structure

Feature-based layout:

- `src/features/[feature]/components` — presentational UI
- `src/features/[feature]/hooks` — logic and state hooks
- `src/features/[feature]/types.ts` — feature types
- `src/components` — shared/global UI

## Development Notes

- TypeScript: strict typing (avoid `any`).
- State: prefer local hooks; use Zustand for global UI state if needed.
- Data fetching: use TanStack Query (if you add server calls).
- Tests: use Vitest + React Testing Library for hooks and components.

## Commit & PR Guidelines

- Make atomic commits grouped by concern (config, scaffold, components, hooks, docs).
- Use branch names like `feat/note-reader` and include screenshots/GIFs for UI changes.
- Run linters/formatters before committing (add commands if configured).
