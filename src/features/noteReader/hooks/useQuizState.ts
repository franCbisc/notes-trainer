/**
 * Hook for managing quiz state (current note, answers, selected)
 */

import { useState, useCallback, useRef } from "react";
import { Note, AnswerStatus } from "../types";
import { midiToNoteNameWithOctave } from "../utils/pitchUtils";

/** Duration (ms) of the wrong-answer flash before the quiz resumes listening. */
const WRONG_FLASH_MS = 1000;

/**
 * Enharmonic equivalents in Italian notation (both directions).
 * Sharp → flat  and  flat → sharp, so we can match either spelling.
 */
const ENHARMONIC_EQUIVALENTS: Record<string, string> = {
    "Do#":  "Reb",
    "Reb":  "Do#",
    "Re#":  "Mib",
    "Mib":  "Re#",
    "Fa#":  "Solb",
    "Solb": "Fa#",
    "Sol#": "Lab",
    "Lab":  "Sol#",
    "La#":  "Sib",
    "Sib":  "La#",
    "Si#":  "Do",
    "Dob":  "Si",
};

/**
 * How many semitones away from the target MIDI the played note can be and
 * still be considered "the same note in the right octave".
 * 6 semitones = half an octave, so it accepts the note only within its own
 * octave (e.g. Do4 accepts anything from Fa#3 to Fa#4, which practically
 * means only Do4 itself since we already checked the name).
 */
const OCTAVE_TOLERANCE_SEMITONES = 6;

/** Returns true when `played` is the same pitch as `target` (enharmonics included). */
function isSamePitch(played: string, target: string): boolean {
    return played === target || ENHARMONIC_EQUIVALENTS[played] === target;
}

/**
 * Returns true when the played MIDI is within OCTAVE_TOLERANCE_SEMITONES of
 * the target MIDI, meaning it is in the correct octave.
 */
function isCorrectOctave(playedMidi: number, targetMidi: number): boolean {
    return Math.abs(playedMidi - targetMidi) <= OCTAVE_TOLERANCE_SEMITONES;
}

export function useQuizState(onNoteChange: (note: Note) => void) {
    const [current, setCurrent] = useState<Note | null>(null);
    const [answered, setAnswered] = useState<AnswerStatus>(null);
    const [selected, setSelected] = useState<string | null>(null);

    const wrongFlashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const advance = useCallback((note: Note) => {
        if (wrongFlashTimerRef.current !== null) {
            clearTimeout(wrongFlashTimerRef.current);
            wrongFlashTimerRef.current = null;
        }
        setCurrent(note);
        setAnswered(null);
        setSelected(null);
    }, []);

    const handleAnswer = useCallback(
        (name: string, playedMidi?: number): boolean => {
            if (answered === "correct" || !current) {
                return false;
            }

            const nameMatches = isSamePitch(name, current.name);
            const octaveMatches = playedMidi === undefined || current.midi === undefined || isCorrectOctave(playedMidi, current.midi);
            const isCorrect = nameMatches && octaveMatches;
            const playedNoteDisplay = playedMidi !== undefined
                ? (midiToNoteNameWithOctave(playedMidi) ?? name)
                : name;
            setSelected(playedNoteDisplay);

            if (isCorrect) {
                setAnswered("correct");
            } else {
                setAnswered("wrong");
                wrongFlashTimerRef.current = setTimeout(() => {
                    wrongFlashTimerRef.current = null;
                    setAnswered(null);
                    setSelected(null);
                }, WRONG_FLASH_MS);
            }

            return isCorrect;
        },
        [answered, current]
    );

    return {
        current,
        answered,
        selected,
        advance,
        handleAnswer,
    };
}
