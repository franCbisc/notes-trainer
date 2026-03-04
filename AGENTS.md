# AI AGENT INSTRUCTIONS: React + TypeScript Engineering Standards

## Core Philosophy
You are a Senior Software Engineer. Every response must prioritize **Maintainability**, **Type Safety**, and **Testability**. Follow "Clean Code" principles: code is written for humans to read and only incidentally for machines to execute.

---

## 1. SOLID Principles in React
* **S (Single Responsibility):** Separate logic from UI. Logic goes into Custom Hooks; UI goes into "Atoms" or "Molecules".
* **O (Open/Closed):** Use Composition and Render Props. Components should be extendable via `props` without modifying their internal source code.
* **L (Liskov Substitution):** Custom UI components (e.g., `Input`, `Button`) must extend and spread standard HTML attributes.
* **I (Interface Segregation):** Components should only accept the specific props they need. Avoid passing giant "God Objects".
* **D (Dependency Inversion):** Use Context or Providers to inject external dependencies (API clients, Analytics) rather than hard-coding them in components.

---

## 2. Technical Requirements

### **TypeScript & Typing**
* **Strict Mode:** No `any`. No `@ts-ignore`.
* **Discriminated Unions:** Use for state (e.g., `{ status: 'loading' } | { status: 'error', error: string }`).
* **Utility Types:** Use `Pick`, `Omit`, and `Partial` to maintain DRY interfaces.
* **Inference:** Let TypeScript infer types where obvious; explicitly type function returns and exported interfaces.

### **React Patterns**
* **Functional Components:** Always use `const Component: React.FC<Props> = ...` or standard function declarations.
* **Hooks:** Hooks must be at the top level. Complex logic (API calls, side effects) **must** be abstracted into custom hooks (e.g., `useAuth`, `useProjectData`).
* **Performance:** Use `useMemo` and `useCallback` only when expensive computations or referential stability are required.

### **State Management**
* **Server State:** Use **TanStack Query** (React Query). No manual `useEffect` fetching.
* **Global State:** Use **Zustand** for global UI state.
* **Local State:** Use `useState`/`useReducer` and keep it as local as possible.

---

## 3. Testing & Quality
* **Testing Library:** Every logic-heavy component/hook must have a `.test.tsx` file using Vitest and React Testing Library.
* **Behavioral Testing:** Test what the user sees, not the internal state.
* **Early Returns:** Minimize nesting. If a condition is false, return `null` or the fallback early.
* **Unit tests:** Every component and hook must have unit tests covering all branches of logic, including edge cases and error states.
* The test will be inside a `__tests__` folder next to the component or hook it tests.

---

## 4. Anti-Patterns (Never Do This)
- No `useEffect` for data fetching — use TanStack Query or Apollo hooks
- No `useEffect` for derived state — compute it inline or with `useMemo`
- No prop drilling past 2 levels — lift to Zustand or Context
- No `any` type, ever — use `unknown` and narrow it
- No `React.FC`: import { FC } from "react" instead
- No hardcoded strings for routes — define route constants in `src/lib/routes.ts`
- No business logic inside JSX — extract to a hook or helper function
- No component files longer than ~150 lines — split into smaller components



## 5. Architecture (Feature-Based)
Organize code by **Feature**, not by file type:
```text
src/
 ├── features/
 │    └── [feature-name]/
 │         ├── components/
 │         ├── hooks/
 │         ├── api/
 │         └── types.ts
 ├── components/ (Global/Shared UI)
 ├── lib/        (Third-party configs)
 └── utils/      (Pure helper functions)
