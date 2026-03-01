export interface Note {
    step: number;
    name: string;
    clef: "treble" | "bass";
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
}

export type AnswerStatus = "correct" | "wrong" | null;

export interface AnswersButtonsProps {
    noteNames: readonly string[];
    current: Note;
    selected: string | null;
    answered: AnswerStatus;
    onAnswer: (name: string) => void;
}
