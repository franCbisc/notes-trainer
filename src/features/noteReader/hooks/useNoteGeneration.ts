/**
 * Hook for generating random notes for the quiz
 */

import { useCallback } from "react";
import { Note } from "../types";
import { TREBLE_NOTES, BASS_NOTES } from "../constants";

function pickRandom<T>(arr: readonly T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function isSamePosition(noteA: Note, noteB: Note): boolean {
    return noteA.step === noteB.step && noteA.clef === noteB.clef;
}

export function useNoteGeneration() {
    const generateRandomNote = useCallback((previousNote?: Note): Note => {
        let note: Note;
        // keep generating until we get a note with a different position
        // (different step or clef) from the previous one
        do {
            const clef = Math.random() < 0.5 ? "treble" : "bass";
            const pool = clef === "treble" ? TREBLE_NOTES : BASS_NOTES;
            const picked = pickRandom([...pool]);
            note = { ...picked, clef };
        } while (previousNote && isSamePosition(note, previousNote));

        return note;
    }, []);

    return { generateRandomNote };
}

