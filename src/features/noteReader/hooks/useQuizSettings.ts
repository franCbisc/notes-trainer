/**
 * Hook for managing quiz settings state (mode, clef filter, key)
 */

import { useState, useCallback } from "react";
import type { ClefFilter, QuizMode, QuizSettingsReturn } from "../types";

export function useQuizSettings(): QuizSettingsReturn {
    const [clefFilter, setClefFilter] = useState<ClefFilter>("both");
    const [selectedKey, setSelectedKey] = useState<string>("Do");
    const [mode, setMode] = useState<QuizMode>("automatic");
    const [hasPlayedFirstNote, setHasPlayedFirstNote] = useState(false);

    const markFirstNotePlayed = useCallback(() => {
        setHasPlayedFirstNote(true);
    }, []);

    return {
        clefFilter,
        setClefFilter,
        selectedKey,
        setSelectedKey,
        mode,
        setMode,
        hasPlayedFirstNote,
        markFirstNotePlayed,
    };
}
