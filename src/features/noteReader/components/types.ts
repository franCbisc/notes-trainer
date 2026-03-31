/**
 * Component-specific props for the noteReader feature.
 */

import type { Note, AnswerStatus, KeyAccidental, ClefFilter } from "../types";
import type { QuizMode } from "../hooks/types";

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
    permission: "idle" | "requesting" | "granted" | "denied" | "unsupported";
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
    selectedKey: string;
    onKeyChange: (key: string) => void;
}

export interface KeySignatureAccidentalsProps {
    accidentals: KeyAccidental[];
}

export interface FeedbackProps {
    answered: AnswerStatus;
    mode: QuizMode;
    selected: string | null;
}
