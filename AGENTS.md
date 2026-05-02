# AI Agent Instructions — Notes Trainer

## Project Overview
Notes Trainer is a React + TypeScript web app for practicing musical note reading on grand staff. Users identify notes via manual button clicks or real-time piano pitch detection through microphone. Single-page app, no backend, client-side only.

## Tech Stack (Exact Versions)
- **React 18.3.1** + **TypeScript 5.6.3** (strict mode)
- **Vite 5.4.8** (build tool)
- **Jest 30.2.0** + **ts-jest 29.4.6** + **React Testing Library 14.3.1**
- **pitchy 4.1.0** (MPM pitch detection)
- **ESLint 9.39.4** + **typescript-eslint 8.57.0**
- **Husky 9.1.7** (git hooks)

## Build & Verification Commands
```bash
npm run dev              # Start dev server
npm run build            # Production build (runs tsc -b first)
npm test                 # Run all tests
npm test -- --testPathPattern=src/features/noteReader/hooks/usePitchDetection  # Single test file
npm run test:coverage    # Tests with coverage report (100% required)
npm run format:check     # Lint check (eslint . --ext .ts,.tsx)
npm run format           # Auto-fix lint errors
```

**Done criteria:** All commands above must pass before considering any task complete.

## Architecture
Feature-based structure (single feature: `noteReader`):
```
src/features/noteReader/
├── NoteReaderPage.tsx    # Main page orchestrator
├── types.ts              # Interfaces
├── hooks/                # Custom hooks (logic separation)
├── components/           # UI components (notation/, quiz/, overlays/)
└── utils/                # pitchUtils.ts
```

**State management:** Local hooks only. No Redux, no Zustand, no TanStack Query. This is a client-side app with no server state.

## Critical Rules
1. **No `any` type** — use `unknown` + type narrowing
2. **No `useEffect` for data fetching** — use custom hooks
3. **No `React.FC`** — use `import { FC } from 'react'` or function declarations
4. **Max 150 lines per component** — split into smaller components
5. **No prop drilling past 2 levels** — lift to hooks/context
6. **No hardcoded routes** — not applicable (single-page app, no routing)
7. **No business logic in JSX** — extract to hooks/helpers
8. **Functional components only** — no class components

## TypeScript Conventions
- Strict mode enabled (tsconfig.json)
- Use discriminated unions for state: `{ status: 'loading' } | { status: 'error'; error: string }`
- Use `Pick`, `Omit`, `Partial` for DRY interfaces
- Let inference work; explicitly type function returns and exports

## Testing Requirements
- **Framework:** Jest + React Testing Library
- **Coverage:** 100% statements, branches, functions, lines (enforced in jest config)
- **Location:** `__tests__/` folder next to the file being tested
- **Pattern:** Behavioral testing (user sees) not implementation details
- **Run single test:** `npm test -- --testPathPattern=path/to/file`

## Component Patterns
```typescript
// Good: Hook extracts logic
const NoteHead: FC<NoteHeadProps> = ({ note, status }) => {
  // Only rendering logic here
  return <circle cx={note.x} cy={note.y} r={10} className={status} />
}

// Logic in custom hook
const useQuizState = () => {
  const [current, setCurrent] = useState<Note | null>(null)
  // ... logic here
}
```

## File Boundaries (Never Modify)
- `src/main.tsx` — Entry point, minimal changes only
- `vite.config.ts` — Build configuration
- `tsconfig*.json` — TypeScript configs
- `eslint.config.mjs` — Linting rules
- `package.json` — Dependencies (ask before adding)

## Known Gotchas
- Pitch detection uses state machine pattern in `usePitchDetection.ts` — don't convert to simple useEffect
- Italian notation (Do, Re, Mi) not English (C, D, E) — preserve this convention
- SVG staff rendering uses custom layout constants in `svgLayout.ts` — modify carefully
- Audio context must be created on user gesture (browser autoplay policy)

## Git Workflow
- **Commit:** Only when explicitly asked
- **Husky hooks:** Lint runs automatically on commit
- **Branch naming:** Not enforced, but descriptive names preferred

---

## Additional Context Files

For detailed explanations of engineering principles and patterns, see:
- **.agents/skills/solid-principles/SKILL.md** — SOLID principles, React patterns, testing philosophy
- **.agents/skills/project-context/SKILL.md** — Full project architecture and data flows
- **.agents/skills/frontend-design/SKILL.md** — UI/UX design guidelines
