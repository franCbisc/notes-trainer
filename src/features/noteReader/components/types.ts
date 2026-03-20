/**
 * Component-specific props for the noteReader feature.
 */

import type { Note, AnswerStatus, KeyAccidental } from "../types";

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
