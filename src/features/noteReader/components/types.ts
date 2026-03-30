/**
 * Component-specific props for the noteReader feature.
 */

import type { Note, AnswerStatus, KeyAccidental, ClefFilter } from "../types";

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
    permission: "idle" | "granted" | "denied";
    onRequestMic: () => void;
}

export interface SettingsIconProps {
    onClick: () => void;
}

export interface HeaderProps {
    settingsOpen: boolean;
    onSettingsToggle: () => void;
    onSettingsClose: () => void;
    mode: "manual" | "automatic";
    onModeChange: (mode: "manual" | "automatic") => void;
    clefFilter: ClefFilter;
    onClefChange: (clef: ClefFilter) => void;
    selectedKey: string;
    onKeyChange: (key: string) => void;
}

export interface SettingsPanelProps {
    open: boolean;
    onClose: () => void;
    mode: "manual" | "automatic";
    onModeChange: (mode: "manual" | "automatic") => void;
    clefFilter: ClefFilter;
    onClefChange: (clef: ClefFilter) => void;
    selectedKey: string;
    onKeyChange: (key: string) => void;
}

export interface KeySignatureAccidentalsProps {
    accidentals: KeyAccidental[];
}
