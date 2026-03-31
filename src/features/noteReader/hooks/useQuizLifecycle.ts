/**
 * Hook for quiz lifecycle: advancing notes based on settings changes and answer status
 */

import { useEffect, useRef } from "react";
import type { UseQuizLifecycleProps } from "./types";

const ADVANCE_DELAY_MS = 300;

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
        }, ADVANCE_DELAY_MS);
        return () => clearTimeout(timer);
    }, [answered, advance, generateRandomNote, current]);
}
