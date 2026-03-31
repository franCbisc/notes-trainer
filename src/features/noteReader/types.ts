/**
 * Domain types for the NoteReader feature.
 */

export interface Note {
    step: number;
    name: string;
    clef: "treble" | "bass";
    /** MIDI note number for the specific octave shown on the staff (e.g. 60 = C4). */
    midi?: number;
}

export type AnswerStatus = "correct" | "wrong" | null;

export type ClefFilter = "both" | "treble" | "bass";

export interface DetectedPitch {
    note: string;
    midi: number;
    frequency: number;
    clarity: number;
}

export interface UsePitchDetectionReturn {
    detectedPitch: DetectedPitch | null;
    isListening: boolean;
    permission: MicPermission;
    startListening: () => Promise<void>;
    stopListening: () => void;
    consumeNote: () => void;
}

/** A single accidental in a key signature */
export interface KeyAccidental {
    /** Base note name (without accidental), e.g. "Fa" */
    baseName: string;
    /** Type of accidental */
    accidental: "#" | "b";
    /** Staff step for treble clef */
    trebleStep: number;
    /** Staff step for bass clef */
    bassStep: number;
}

/** Map from Italian key name to its list of accidentals */
export type KeySignatureMap = Record<string, KeyAccidental[]>;

// ─── Hook Types ───────────────────────────────────────────────────────────────────

export type QuizMode = "manual" | "automatic";

export type MicPermission = "idle" | "requesting" | "granted" | "denied" | "unsupported";

export interface UseQuizLifecycleProps {
    current: Note | null;
    answered: AnswerStatus;
    advance: (note: Note) => void;
    generateRandomNote: (previousNote?: Note) => Note;
    clefFilter: ClefFilter;
    selectedKey: string;
    mode: QuizMode;
}

export interface QuizSettingsReturn {
    clefFilter: ClefFilter;
    setClefFilter: (filter: ClefFilter) => void;
    selectedKey: string;
    setSelectedKey: (key: string) => void;
    mode: QuizMode;
    setMode: (mode: QuizMode) => void;
    hasPlayedFirstNote: boolean;
    markFirstNotePlayed: () => void;
}

export interface UseAutomaticModeProps {
    mode: QuizMode;
    permission: MicPermission;
    detectedPitch: DetectedPitch | null;
    answered: AnswerStatus;
    onAnswer: (name: string, midi: number) => boolean;
    onConsumeNote: () => void;
    onStartListening: () => Promise<void>;
    onStopListening: () => void;
}

export interface UseAutomaticModeReturn {
    isListening: boolean;
    detectedPitch: DetectedPitch | null;
    showMicPrompt: boolean;
    micDenied: boolean;
}

// ─── Component Props Types ─────────────────────────────────────────────────────

export interface StaffLinesProps {
    cy: number;
}

export interface NoteHeadProps {
    step: number;
    cy: number;
    answerStatus: AnswerStatus;
}

export interface TrebleClefProps {
    cy: number;
}

export interface BassClefProps {
    cy: number;
}

export interface GrandStaffProps {
    current: Note;
    answered: boolean;
    correct: boolean;
    keyAccidentals?: KeyAccidental[];
}

export interface AnswersButtonsProps {
    noteNames: readonly string[];
    selected: string | null;
    answered: AnswerStatus;
    onAnswer: (name: string) => void;
}

export interface MicPromptProps {
    permission: MicPermission;
    onStartListening: () => Promise<void>;
    onSwitchToManual: () => void;
}

export interface SettingsIconProps {
    onClick: () => void;
}

export interface HeaderProps {
    mode: QuizMode;
    onModeChange: (mode: QuizMode) => void;
    clefFilter: ClefFilter;
    onClefChange: (clef: ClefFilter) => void;
}

export interface SettingsPanelProps {
    open: boolean;
    onClose: () => void;
    mode: QuizMode;
    clefFilter: ClefFilter;
    onClefChange: (clef: ClefFilter) => void;
}

export interface KeySignatureAccidentalsProps {
    accidentals: KeyAccidental[];
}

export interface FeedbackProps {
    answered: AnswerStatus;
    mode: QuizMode;
    selected: string | null;
}
