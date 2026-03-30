/**
 * Hook for quiz lifecycle: advancing notes based on settings changes and answer status
 */

import { useEffect } from "react";
import type { Note } from "../types";

interface UseQuizLifecycleProps {
    current: Note | null;
    answered: "correct" | "wrong" | null;
    advance: (note: Note) => void;
    generateRandomNote: (previousNote?: Note) => Note;
    clefFilter: string;
    selectedKey: string;
    mode: string;
}

export function useQuizLifecycle({
    current,
    answered,
    advance,
    generateRandomNote,
    clefFilter,
    selectedKey,
    mode,
}: UseQuizLifecycleProps) {
    useEffect(() => {
        if (!current) {
            advance(generateRandomNote());
        }
    }, [current, advance, generateRandomNote]);

    useEffect(() => {
        advance(generateRandomNote());
    }, [clefFilter, advance, generateRandomNote]);

    useEffect(() => {
        advance(generateRandomNote());
    }, [selectedKey, advance, generateRandomNote]);

    useEffect(() => {
        advance(generateRandomNote());
    }, [mode, advance, generateRandomNote]);

    useEffect(() => {
        if (answered !== "correct") return;

        const timer = setTimeout(() => {
            advance(generateRandomNote(current || undefined));
        }, 300);
        return () => clearTimeout(timer);
    }, [answered, advance, generateRandomNote, current]);
}
