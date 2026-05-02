# Project Context: Notes Trainer

## Quick Reference for AI Agents

Load this skill when you need to understand the Notes Trainer web app's purpose, architecture, and capabilities without exploring the entire codebase.

---

## App Overview

**Notes Trainer** is a React + TypeScript single-page web app for practicing musical note reading on the grand staff. Users identify notes displayed on treble/bass clefs through manual button clicks or real-time piano pitch detection via microphone.

**Live URL**: https://notes-trainer.pages.dev/

---

## Tech Stack

- **Framework**: React 18 + TypeScript (strict mode)
- **Build**: Vite 5
- **Audio**: Web Audio API + pitchy (MPM algorithm)
- **Testing**: Jest + React Testing Library (100% coverage required)
- **Styling**: Custom CSS with CSS variables (no UI framework)
- **State**: Local state via custom hooks (no Redux/Zustand)

---

## Architecture

**Feature-based structure** (single feature: `noteReader`):

```
src/features/noteReader/
├── NoteReaderPage.tsx        # Main page orchestrator
├── types.ts                  # TypeScript interfaces
├── constants.ts              # Barrel export for constants
├── notes.ts                  # Note definitions
├── keySignatures.ts          # Key signature data
├── circleOfFifths.ts         # Circle geometry
├── svgLayout.ts              # SVG dimensions
├── timing.ts                 # Timing constants
├── hooks/                    # Custom hooks (logic separation)
│   ├── useQuizSettings.ts    # Mode, clef, key settings
│   ├── useQuizState.ts       # Current note, answer state
│   ├── usePitchDetection.ts  # Mic + pitch detection state machine
│   ├── useMicrophone.ts      # Web Audio API management
│   ├── useAutomaticMode.ts   # Auto-mode orchestration
│   ├── useQuizLifecycle.ts   # Note advancement logic
│   └── useNoteGeneration.ts  # Random note generation
├── components/
│   ├── notation/             # SVG staff rendering
│   │   ├── GrandStaff.tsx
│   │   ├── NoteHead.tsx
│   │   └── ...
│   ├── quiz/                 # Quiz UI
│   │   ├── AnswersButtons.tsx
│   │   ├── CircleOfFifths.tsx
│   │   └── ...
│   └── overlays/             # Settings, modals
└── utils/
    └── pitchUtils.ts         # Frequency/note conversion
```

---

## Key Features

1. **Quiz Modes**:
   - **Manual**: Click note name buttons (Do, Re, Mi, Fa, Sol, La, Si - Italian notation)
   - **Automatic**: Play notes on real piano, detect via microphone

2. **Clef Options**: Treble only, Bass only, or Grand Staff (both)

3. **Key Signatures**: 12 keys selectable via interactive Circle of Fifths (automatic mode)

4. **Real-time Audio**:
   - Web Audio API for microphone input
   - State machine architecture for stable pitch detection
   - Octave error correction algorithm

5. **Visual Feedback**: Color-coded correct/wrong answers with auto-advance

---

## Data Flow

### Manual Mode
```
User clicks button → handleAnswer() → QuizState updated → Feedback displayed → delay → New note generated
```

### Automatic Mode
```
Microphone → AudioContext → AnalyserNode → PitchDetector → frequencyToNote() → State machine validation → handleAnswer()
```

---

## TypeScript Interfaces (Key Types)

```typescript
type QuizMode = 'manual' | 'automatic'
type ClefFilter = 'treble' | 'bass' | 'both'
type AnswerStatus = 'correct' | 'wrong' | null

interface Note {
  name: string      // "Do", "Re", etc.
  midi: number      // MIDI note number
  clef: 'treble' | 'bass'
  position: number  // Y position on staff
}

interface QuizState {
  current: Note | null
  answered: boolean
  selected: string | null
  status: AnswerStatus
}
```

---

## State Management

No global state library. All state is localized via custom hooks:

| Hook | State | Storage |
|------|-------|---------|
| `useQuizSettings` | clefFilter, selectedKey, mode | `useState` |
| `useQuizState` | current note, answered, selected | `useState` + `useRef` |
| `usePitchDetection` | detectedPitch, isListening | `useState` + `useRef` |
| `useMicrophone` | permission, audioContext | `useState` + `useRef` |

---

## Testing Requirements

- **Framework**: Jest + React Testing Library
- **Coverage**: 100% (statements, branches, functions, lines)
- **Location**: `__tests__` folders next to components/hooks
- **Pattern**: Behavioral testing (what user sees, not internal state)

---

## Code Standards (from AGENTS.md)

- **SOLID principles** in React (hooks for logic separation)
- **No `useEffect` for data fetching** (use custom hooks)
- **No `any` type** (use `unknown` + narrowing)
- **No prop drilling past 2 levels** (lift to hooks/context)
- **Max ~150 lines per component** (split into smaller components)
- **Feature-based folders** (group by domain, not file type)

---

## Common Tasks & Patterns

### Adding a new feature:
1. Create folder in `src/features/[featureName]/`
2. Split into `components/`, `hooks/`, `utils/`, `types.ts`
3. Create `__tests__/` next to files being tested
4. Export via `index.ts` barrel files

### Modifying quiz logic:
- Hook to modify: `useQuizState.ts` or `useQuizLifecycle.ts`
- Note generation: `useNoteGeneration.ts`
- Types: `types.ts`

### Modifying audio/pitch detection:
- Core logic: `usePitchDetection.ts` (state machine)
- Audio management: `useMicrophone.ts`
- Utilities: `utils/pitchUtils.ts`

### Modifying UI:
- Staff/notation: `components/notation/`
- Quiz interface: `components/quiz/`
- Overlays/modals: `components/overlays/`
- Styles: `src/style.css`

---

## External Dependencies

- **pitchy**: MPM pitch detection algorithm
- **Web Audio API**: Microphone access, audio processing
- **Google Fonts**: DM Sans, DM Mono, Noto Music

No backend API - fully client-side.

---

## Possibilities for Extension

- Add more clefs (alto, tenor)
- Add rhythm training mode
- Add user accounts/progress tracking
- Add different notation systems (English: C, D, E vs Italian: Do, Re, Mi)
- Add sheet music rendering improvements
- Add mobile touch support enhancements
