/**
 * Hook for managing quiz state (current note, answers, score)
 */

import { useState, useCallback, useRef } from "react";
import { Note, AnswerStatus } from "../types";

/** Duration (ms) of the wrong-answer flash before the quiz resumes listening. */
const WRONG_FLASH_MS = 1000;

interface QuizScore {
    correct: number;
    total: number;
}

export function useQuizState(onNoteChange: (note: Note) => void) {
    const [current, setCurrent] = useState<Note | null>(null);
    const [answered, setAnswered] = useState<AnswerStatus>(null);
    const [selected, setSelected] = useState<string | null>(null);
    const [score, setScore] = useState<QuizScore>({ correct: 0, total: 0 });

    /** Timer ref used to clear a pending wrong-flash reset. */
    const wrongFlashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const resetQuiz = useCallback(() => {
        if (wrongFlashTimerRef.current !== null) {
            clearTimeout(wrongFlashTimerRef.current);
            wrongFlashTimerRef.current = null;
        }
        setScore({ correct: 0, total: 0 });
        onNoteChange({ step: 0, name: "Do", clef: "treble" });
    }, [onNoteChange]);

    const advance = useCallback((note: Note) => {
        if (wrongFlashTimerRef.current !== null) {
            clearTimeout(wrongFlashTimerRef.current);
            wrongFlashTimerRef.current = null;
        }
        setCurrent(note);
        setAnswered(null);
        setSelected(null);
    }, []);

    const handleAnswer = useCallback(
        (name: string): boolean => {
            if (answered === "correct" || !current) {
                return false;
            }

            const isCorrect = name === current.name;
            setSelected(name);

            if (isCorrect) {
                setAnswered("correct");
                setScore((s) => ({
                    correct: s.correct + 1,
                    total: s.total + 1,
                }));
            } else {
                // Manual mode: flash red then reset so the user can guess again.
                // Automatic mode: same flash behaviour.
                setAnswered("wrong");
                wrongFlashTimerRef.current = setTimeout(() => {
                    wrongFlashTimerRef.current = null;
                    setAnswered(null);
                    setSelected(null);
                }, WRONG_FLASH_MS);
            }

            return isCorrect;
        },
        [answered, current]
    );

    const percentage = score.total > 0 ? Math.round((score.correct / score.total) * 100) : null;

    return {
        current,
        setCurrent,
        answered,
        setAnswered,
        selected,
        setSelected,
        score,
        setScore,
        advance,
        handleAnswer,
        resetQuiz,
        percentage,
    };
}

