import type { useMicrophone } from "./hooks/useMicrophone";

export interface Note {
    step: number;
    name: string;
    clef: "treble" | "bass";
    /** MIDI note number for the specific octave shown on the staff (e.g. 60 = C4). */
    midi: number;
}

export interface StaffLinesProps {
    cy: number;
}

export interface NoteHeadProps {
    step: number;
    cy: number;
    answered: boolean;
    correct: boolean;
}

export interface BraceProps {
    topY: number;
    botY: number;
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

export type AnswerStatus = "correct" | "wrong" | null;

export type ClefFilter = "both" | "treble" | "bass";

export interface AnswersButtonsProps {
    noteNames: readonly string[];
    selected: string | null;
    answered: AnswerStatus;
    onAnswer: (name: string) => void;
}

export interface DetectedPitch {
    note: string;
    midi: number;
    frequency: number;
    clarity: number;
}

export interface UsePitchDetectionReturn {
    detectedPitch: DetectedPitch | null;
    isListening: boolean;
    permission: ReturnType<typeof useMicrophone>["permission"];
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
