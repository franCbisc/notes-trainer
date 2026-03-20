/**
 * Hook for automatic mode logic: microphone listening, pitch detection consumption,
 * and providing listening indicator data.
 */

import { useEffect } from "react";
import type { DetectedPitch } from "../types";
import type { QuizMode } from "./useQuizSettings";

type PermissionStatus = "idle" | "requesting" | "granted" | "denied" | "unsupported";

interface UseAutomaticModeProps {
    mode: QuizMode;
    permission: PermissionStatus;
    detectedPitch: DetectedPitch | null;
    answered: "correct" | "wrong" | null;
    onAnswer: (name: string, midi: number) => boolean;
    onConsumeNote: () => void;
    onStartListening: () => Promise<void>;
    onStopListening: () => void;
}

interface UseAutomaticModeReturn {
    isListening: boolean;
    detectedPitch: DetectedPitch | null;
    showMicPrompt: boolean;
    micDenied: boolean;
}

export function useAutomaticMode({
    mode,
    permission,
    detectedPitch,
    answered,
    onAnswer,
    onConsumeNote,
    onStartListening,
    onStopListening,
}: UseAutomaticModeProps): UseAutomaticModeReturn {
    const isAutomatic = mode === "automatic";
    const isGranted = permission === "granted";

    useEffect(() => {
        if (isAutomatic) {
            onStartListening();
        } else {
            onStopListening();
        }
    }, [isAutomatic, onStartListening, onStopListening]);

    useEffect(() => {
        if (isAutomatic && detectedPitch && !answered) {
            onAnswer(detectedPitch.note, detectedPitch.midi);
            onConsumeNote();
        }
    }, [isAutomatic, detectedPitch, answered, onAnswer, onConsumeNote]);

    return {
        isListening: isAutomatic && isGranted,
        detectedPitch: isAutomatic && isGranted ? detectedPitch : null,
        showMicPrompt: isAutomatic && !isGranted,
        micDenied: permission === "denied" || permission === "unsupported",
    };
}
