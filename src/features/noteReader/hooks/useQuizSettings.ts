/**
 * Hook for managing quiz settings state (mode, clef filter, key, settings panel)
 */

import { useState, useCallback } from "react";
import type { ClefFilter } from "../types";
import type { QuizMode, QuizSettingsReturn } from "./types";

export type { QuizMode } from "./types";

export function useQuizSettings(): QuizSettingsReturn {
    const [clefFilter, setClefFilter] = useState<ClefFilter>("both");
    const [selectedKey, setSelectedKey] = useState<string>("Do");
    const [mode, setMode] = useState<QuizMode>("manual");
    const [settingsOpen, setSettingsOpen] = useState(false);

    const toggleSettings = useCallback(() => {
        setSettingsOpen((o) => !o);
    }, []);

    const closeSettings = useCallback(() => {
        setSettingsOpen(false);
    }, []);

    const handleModeChange = useCallback(
        (newMode: QuizMode) => {
            setMode(newMode);
            setSettingsOpen(false);
        },
        [setMode]
    );

    return {
        clefFilter,
        setClefFilter,
        selectedKey,
        setSelectedKey,
        mode,
        setMode,
        settingsOpen,
        setSettingsOpen,
        toggleSettings,
        closeSettings,
        handleModeChange,
    };
}
