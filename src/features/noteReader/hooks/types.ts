/**
 * Hook-specific types for the noteReader feature.
 */

import type { Note, ClefFilter, DetectedPitch } from "../types";
import type { MicPermission } from "./useMicrophone";

export type QuizMode = "manual" | "automatic";

export interface UseQuizLifecycleProps {
    current: Note | null;
    answered: "correct" | "wrong" | null;
    advance: (note: Note) => void;
    generateRandomNote: (previousNote?: Note) => Note;
    clefFilter: string;
    selectedKey: string;
    mode: string;
}

export interface QuizSettingsReturn {
    clefFilter: ClefFilter;
    setClefFilter: (filter: ClefFilter) => void;
    selectedKey: string;
    setSelectedKey: (key: string) => void;
    mode: QuizMode;
    setMode: (mode: QuizMode) => void;
    handleModeChange: (mode: QuizMode) => void;
    hasPlayedFirstNote: boolean;
    markFirstNotePlayed: () => void;
}

export interface UseAutomaticModeProps {
    mode: QuizMode;
    permission: MicPermission;
    detectedPitch: DetectedPitch | null;
    answered: "correct" | "wrong" | null;
    onAnswer: (name: string, midi: number) => boolean;
    onConsumeNote: () => void;
    onStartListening: () => Promise<void>;
    onStopListening: () => void;
}

export interface UseAutomaticModeReturn {
    isListening: boolean;
    detectedPitch: DetectedPitch | null;
    showMicPrompt: boolean;
    micDenied: boolean;
}
