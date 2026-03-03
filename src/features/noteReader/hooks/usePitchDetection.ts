/**
 * Hook for pitch detection (MVP - Mock implementation)
 * Real implementation with actual microphone input will come later
 */

import { useState, useCallback, useEffect } from "react";
import { NOTE_NAMES } from "../constants";

export function usePitchDetection() {
    const [detectedNote, setDetectedNote] = useState<string | null>(null);
    const [isListening, setIsListening] = useState(false);

    const startListening = useCallback(() => {
        setIsListening(true);
        // MVP: Simulate pitch detection with random note selection
        // TODO: Replace with actual Web Audio API pitch detection
    }, []);

    const stopListening = useCallback(() => {
        setIsListening(false);
        setDetectedNote(null);
    }, []);

    // Simulate pitch detection when listening
    useEffect(() => {
        if (!isListening) return;

        // MVP: Randomly select a note to simulate detection
        // In real implementation, this would process audio from microphone
        const timer = setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * NOTE_NAMES.length);
            setDetectedNote(NOTE_NAMES[randomIndex]);
        }, 300);

        return () => clearTimeout(timer);
    }, [isListening]);

    return {
        detectedNote,
        isListening,
        startListening,
        stopListening,
    };
}

