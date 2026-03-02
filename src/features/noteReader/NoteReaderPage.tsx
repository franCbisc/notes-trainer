/**
 * NoteReaderPage - Main page component for the Note Reader quiz
 * Combines the SVG visualization with the quiz logic
 */

import React, { FC, useEffect } from "react";
import { GrandStaff, AnswersButtons } from "./components";
import { useNoteGeneration, useQuizState } from "./hooks";
import { NOTE_NAMES } from "./constants";
import "../../style.css";

export const NoteReaderPage: FC = () => {
    const { generateRandomNote } = useNoteGeneration();
    const { current, answered, setAnswered, selected, score, advance, handleAnswer, resetQuiz, percentage } =
        useQuizState(generateRandomNote);

    // Initialize first note
    useEffect(() => {
        if (!current) {
            advance(generateRandomNote());
        }
    }, [current, advance, generateRandomNote]);

    // Auto-advance after answer
    useEffect(() => {
        if (answered !== null) {
            const delay = answered === "correct" ? 300 : 800;
            const timer = setTimeout(() => {
                advance(generateRandomNote(current || undefined));
            }, delay);
            return () => {
                clearTimeout(timer);
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [answered, current]);

    if (!current) {
        return <div className="root">Loading...</div>;
    }

    return (
        <div className="root">
            <header className="header">
                <h1 className="title">Notes reading trainer</h1>
            </header>

            {/* Score section */}
            <div className="scoreRow">
                <span>{score.correct} / {score.total}</span>
                {percentage !== null && <span className="pct">{percentage}%</span>}
                <button className="resetBtn" onClick={() => resetQuiz()}>
                    Restart
                </button>
            </div>

            {/* Musical staff visualization */}
            <div className="staffCard">
                <GrandStaff current={current} answered={!!answered} correct={answered === "correct"} />
            </div>

            {/* Feedback message */}
            <div className="feedback" style={{ opacity: answered ? 1 : 0, pointerEvents: "none" }}>
                {answered === "correct" && <span className="ok">✓ Correct!</span>}
                {answered === "wrong" && (
                    <span className="wrong">
                        ✗ It was <strong>{current.name}</strong>
                    </span>
                )}
            </div>

            <AnswersButtons
                noteNames={NOTE_NAMES}
                current={current}
                selected={selected}
                answered={answered}
                onAnswer={handleAnswer}
            />
        </div>
    );
};

NoteReaderPage.displayName = "NoteReaderPage";
