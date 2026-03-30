/**
 * Hook for managing quiz settings state (mode, clef filter, key, settings panel)
 */

import { useState, useCallback } from "react";
import type { ClefFilter } from "../types";

export type QuizMode = "manual" | "automatic";

interface QuizSettingsReturn {
    clefFilter: ClefFilter;
    setClefFilter: (filter: ClefFilter) => void;
    selectedKey: string;
    setSelectedKey: (key: string) => void;
    mode: QuizMode;
    setMode: (mode: QuizMode) => void;
    settingsOpen: boolean;
    setSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    toggleSettings: () => void;
    closeSettings: () => void;
    handleModeChange: (mode: QuizMode) => void;
}

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
