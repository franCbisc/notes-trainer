/**
 * Hook for generating random notes for the quiz. Keep generating until we get a note
 * with a different position (different step or clef) from the previous one
 */

import { useCallback } from "react";
import { Note } from "../types";
import { TREBLE_NOTES, BASS_NOTES } from "../constants";

function pickRandom<T>(arr: readonly T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function isSamePosition(currentGenerated: Note, previous: Note): boolean {
    return currentGenerated.step === previous.step && currentGenerated.clef === previous.clef;
}

export function useNoteGeneration() {
    const generateRandomNote = useCallback((previousNote?: Note): Note => {
        let note: Note;
        do {
            let binaryRandom = Math.floor(Math.random() * 2); // 0/1
            const clef = binaryRandom < 1 ? "treble" : "bass";
            const notesPool = clef === "treble" ? TREBLE_NOTES : BASS_NOTES;
            const picked = pickRandom([...notesPool]);
            note = { ...picked, clef };
        } while (previousNote && isSamePosition(note, previousNote));

        return note;
    }, []);

    return { generateRandomNote };
}

