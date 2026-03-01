/**
 * Hook for generating random notes for the quiz
 */

import { useCallback } from "react";
import { Note } from "../types";
import { TREBLE_NOTES, BASS_NOTES } from "../constants";

function pickRandom<T>(arr: readonly T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function useNoteGeneration() {
    const generateRandomNote = useCallback((): Note => {
        const clef = Math.random() < 0.5 ? "treble" : "bass";
        const pool = clef === "treble" ? TREBLE_NOTES : BASS_NOTES;
        const note = pickRandom([...pool]);
        return { ...note, clef };
    }, []);

    return { generateRandomNote };
}

