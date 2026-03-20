/**
 * Hook for managing quiz settings state (mode, clef filter, key, settings panel)
 */

import React, { useRef, useState } from "react";
import type { RefObject } from "react";
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
    settingsBtnRef: RefObject<HTMLButtonElement>;
}

export function useQuizSettings(): QuizSettingsReturn {
    const [clefFilter, setClefFilter] = useState<ClefFilter>("both");
    const [selectedKey, setSelectedKey] = useState<string>("Do");
    const [mode, setMode] = useState<QuizMode>("manual");
    const [settingsOpen, setSettingsOpen] = useState(false);
    const settingsBtnRef = useRef<HTMLButtonElement>(null);

    return {
        clefFilter,
        setClefFilter,
        selectedKey,
        setSelectedKey,
        mode,
        setMode,
        settingsOpen,
        setSettingsOpen,
        settingsBtnRef,
    };
}
