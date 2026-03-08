/**
 * Hook for generating random notes for the quiz. Keep generating until we get a note
 * with a different position (different step or clef) from the previous one
 */

import { useCallback } from "react";
import { Note, ClefFilter, KeyAccidental } from "../types";
import { TREBLE_NOTES, BASS_NOTES } from "../constants";

function pickRandom<T>(arr: readonly T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function isSamePosition(currentGenerated: Note, previous: Note): boolean {
    return currentGenerated.step === previous.step && currentGenerated.clef === previous.clef;
}

/**
 * Apply key signature: if the note's base name matches an accidental in the key,
 * append the accidental symbol to the name (e.g. "Fa" → "Fa#").
 */
function applyKeySignature(note: Note, keyAccidentals: KeyAccidental[]): Note {
    const baseName = note.name.replace(/[#b]+$/, "");
    const acc = keyAccidentals.find((a) => a.baseName === baseName);
    if (!acc) return note;
    return { ...note, name: baseName + acc.accidental };
}

export function useNoteGeneration(clefFilter: ClefFilter = "both", keyAccidentals: KeyAccidental[] = []) {
    const generateRandomNote = useCallback((previousNote?: Note): Note => {
        let note: Note;
        do {
            let clef: "treble" | "bass";
            if (clefFilter === "treble" || clefFilter === "bass") {
                clef = clefFilter;
            } else {
                clef = Math.random() < 0.5 ? "treble" : "bass";
            }
            const notesPool = clef === "treble" ? TREBLE_NOTES : BASS_NOTES;
            const picked = pickRandom([...notesPool]);
            note = { ...picked, clef };
        } while (previousNote && isSamePosition(note, previousNote));

        return applyKeySignature(note, keyAccidentals);
    }, [clefFilter, keyAccidentals]);

    return { generateRandomNote };
}
