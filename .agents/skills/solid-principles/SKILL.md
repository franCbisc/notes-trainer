---
name: solid-principles
description: React + TypeScript engineering standards with SOLID principles, testing philosophy, and code quality patterns. Use this skill when discussing architecture decisions, code reviews, refactoring, or implementing new components that need to follow established patterns.
---

# SOLID Principles in React

## Core Philosophy
You are a Senior Software Engineer. Every response must prioritize **Maintainability**, **Type Safety**, and **Testability**. Follow "Clean Code" principles: code is written for humans to read and only incidentally for machines to execute.

## SOLID Principles Applied to React

### S — Single Responsibility
Separate logic from UI. Components should only handle rendering. Logic (state, fetching, side-effects) must be extracted into Custom Hooks. A component should have only one reason to change (UI layout/style).

**Logic in hook:**
```typescript
import { useState } from 'react'
import type { Note } from './types'

const useQuizState = () => {
  const [current, setCurrent] = useState<Note | null>(null)
  return { current, setCurrent }
}
```

### O — Open/Closed Principle
Use Composition and Render Props. Components should be extendable via `props` without modifying their internal source code.

### L — Liskov Substitution
Custom UI components (e.g., `Input`, `Button`) must extend and spread standard HTML attributes. Ensure that extending a component doesn't break the original contract of the base element.

### I — Interface Segregation
Components should only accept the specific props they need. Avoid passing giant "God Objects" (e.g., a whole User object) if a component only needs `user.avatarUrl`. Pass primitive props or narrow interfaces to simplify testing and prevent unnecessary re-renders.

### D — Dependency Inversion
Use Context or Providers to inject external dependencies (API clients, Analytics) rather than hard-coding them in components.

## Technical Requirements

### TypeScript & Typing
- **Strict Mode:** No `any`. No `@ts-ignore`.
- **Discriminated Unions:** Use for state (e.g., `{ status: 'loading' } | { status: 'error'; error: string }`)
- **Utility Types:** Use `Pick`, `Omit`, and `Partial` to maintain DRY interfaces
- **Inference:** Let TypeScript infer types where obvious; explicitly type function returns and exported interfaces

### React Patterns
- **Functional Components:** Use `import { FC } from 'react'` or standard function declarations. No `React.FC`.
- **Hooks:** Hooks must be at the top level. Complex logic (API calls, side effects) **must** be abstracted into custom hooks
- **Performance:** Use `useMemo` and `useCallback` only when expensive computations or referential stability are required
- **Early Returns:** Minimize nesting. If a condition is false, return `null` or the fallback early

### State Management (This Project)
- **Local State Only:** This project uses local hooks only — no Redux, no Zustand, no TanStack Query
- **Server State:** Not applicable (no backend)
- **Global State:** Not applicable (single-page app with localized state)
- **Local State:** `useState`/`useReducer` via custom hooks in `src/features/noteReader/hooks/`

---

## Testing & Quality

### Testing Library
- Every logic-heavy component/hook must have a `.test.tsx` file using Jest and React Testing Library
- **Behavioral Testing:** Test what the user sees, not the internal state
- **Unit tests:** Every component and hook must have unit tests covering all branches of logic, including edge cases and error states
- **Location:** `__tests__/` folder next to the component or hook it tests

### Coverage Requirements
- **Framework:** Jest + React Testing Library
- **Coverage:** 100% statements, branches, functions, lines (enforced in jest config)
- **Run single test:** `npm test -- --testPathPattern=path/to/file`
