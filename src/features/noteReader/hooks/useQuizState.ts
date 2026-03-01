/**
 * Hook for managing quiz state (current note, answers, score)
 */

import { useState, useCallback } from "react";
import { Note, AnswerStatus } from "../types";

interface QuizScore {
    correct: number;
    total: number;
}

export function useQuizState(onNoteChange: (note: Note) => void) {
    const [current, setCurrent] = useState<Note | null>(null);
    const [answered, setAnswered] = useState<AnswerStatus>(null);
    const [selected, setSelected] = useState<string | null>(null);
    const [score, setScore] = useState<QuizScore>({ correct: 0, total: 0 });

    const resetQuiz = useCallback(() => {
        setScore({ correct: 0, total: 0 });
        onNoteChange({ step: 0, name: "Do", clef: "treble" });
    }, [onNoteChange]);

    const advance = useCallback(
        (note: Note) => {
            setCurrent(note);
            setAnswered(null);
            setSelected(null);
        },
        []
    );

    const handleAnswer = useCallback(
        (name: string): boolean => {
            if (answered || !current) return false;

            const isCorrect = name === current.name;
            setSelected(name);
            setAnswered(isCorrect ? "correct" : "wrong");
            setScore((s) => ({
                correct: s.correct + (isCorrect ? 1 : 0),
                total: s.total + 1,
            }));

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

