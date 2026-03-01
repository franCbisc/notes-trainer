# notes-trainer

A small React + TypeScript app for practising musical note reading. 
It provides an interactive quiz UI to learn note positions on the staff.


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


## Project Structure

Feature-based layout:

- `src/features/[feature]/components` — presentational UI
- `src/features/[feature]/hooks` — logic and state hooks
- `src/features/[feature]/types.ts` — feature types
- `src/components` — shared/global UI
