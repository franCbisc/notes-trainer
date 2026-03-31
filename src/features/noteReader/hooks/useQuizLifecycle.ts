/**
 * Hook for quiz lifecycle: advancing notes based on settings changes and answer status
 */

import { useEffect, useRef } from "react";
import type { UseQuizLifecycleProps } from "./types";
import { CORRECT_ANSWER_ADVANCE_DELAY_MS } from "../timing";

export function useQuizLifecycle({
    current,
    answered,
    advance,
    generateRandomNote,
    clefFilter,
    selectedKey,
    mode,
}: UseQuizLifecycleProps) {
    const prevSettingsRef = useRef({ clefFilter, selectedKey, mode });
    const prevSettings = prevSettingsRef.current;

    const hasSettingsChanged =
        prevSettings.clefFilter !== clefFilter ||
        prevSettings.selectedKey !== selectedKey ||
        prevSettings.mode !== mode;

    if (hasSettingsChanged) {
        prevSettingsRef.current = { clefFilter, selectedKey, mode };
    }

    useEffect(() => {
        if (!current) {
            advance(generateRandomNote());
            return;
        }

        if (hasSettingsChanged) {
            advance(generateRandomNote());
        }
    }, [current, advance, generateRandomNote, hasSettingsChanged]);

    useEffect(() => {
        if (answered !== "correct") return;

        const timer = setTimeout(() => {
            advance(generateRandomNote(current ?? undefined));
        }, CORRECT_ANSWER_ADVANCE_DELAY_MS);
        return () => clearTimeout(timer);
    }, [answered, advance, generateRandomNote, current]);
}
