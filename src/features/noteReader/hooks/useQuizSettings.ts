/**
 * Hook for managing quiz settings state (mode, clef filter, key, settings panel)
 */

import { useState } from "react";
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
}

export function useQuizSettings(): QuizSettingsReturn {
    const [clefFilter, setClefFilter] = useState<ClefFilter>("both");
    const [selectedKey, setSelectedKey] = useState<string>("Do");
    const [mode, setMode] = useState<QuizMode>("manual");
    const [settingsOpen, setSettingsOpen] = useState(false);

    return {
        clefFilter,
        setClefFilter,
        selectedKey,
        setSelectedKey,
        mode,
        setMode,
        settingsOpen,
        setSettingsOpen,
    };
}
