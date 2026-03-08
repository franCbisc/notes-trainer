/**
 * NoteReaderPage - Main page component for the Note Reader quiz
 */

import React, { FC, useEffect, useState } from "react";
import { GrandStaff, AnswersButtons, ModeToggle, ClefToggle } from "./components";
import { useNoteGeneration, useQuizState, usePitchDetection } from "./hooks";
import { NOTE_NAMES } from "./constants";
import { ClefFilter } from "./types";
import "../../style.css";

export const NoteReaderPage: FC = () => {
    const [clefFilter, setClefFilter] = useState<ClefFilter>("both");
    const { generateRandomNote } = useNoteGeneration(clefFilter);
    const { current, answered, selected, score, advance, handleAnswer, resetQuiz, percentage, mode, setMode } =
        useQuizState(generateRandomNote);
    const { detectedNote, detectedFrequency, clarity, isListening, permission, startListening, stopListening } =
        usePitchDetection();

    // Initialize first note
    useEffect(() => {
        if (!current) {
            advance(generateRandomNote());
        }
    }, [current, advance, generateRandomNote]);

    // When the clef filter changes, immediately pick a fresh note from the new pool
    useEffect(() => {
        advance(generateRandomNote());
    }, [clefFilter]); // eslint-disable-line react-hooks/exhaustive-deps

    // Handle mode changes
    useEffect(() => {
        if (mode === "automatic") {
            startListening();
        } else {
            stopListening();
        }
    }, [mode]); // eslint-disable-line react-hooks/exhaustive-deps

    // Automatic mode: feed each detected note into the quiz.
    // handleAnswer is a no-op while `answered` is set, so rapid fire from the
    // RAF loop is safe — only the first detection per note-on event goes through.
    useEffect(() => {
        if (mode === "automatic" && detectedNote && !answered) {
            handleAnswer(detectedNote);
        }
    }, [mode, detectedNote, answered, handleAnswer]);

    // Advance to the next note after a correct answer.
    useEffect(() => {
        if (answered !== "correct") return;

        const timer = setTimeout(() => {
            advance(generateRandomNote(current || undefined));
        }, 300);
        return () => clearTimeout(timer);
    }, [answered]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!current) {
        return <div className="root">Loading...</div>;
    }

    const showMicPrompt = mode === "automatic" && permission !== "granted";
    const micDenied = permission === "denied" || permission === "unsupported";

    return (
        <div className="root">
            <header className="header">
                <h1 className="title">Notes trainer</h1>
                <ModeToggle mode={mode} onChange={setMode} />
                <div className="clefFilterRow">
                    <ClefToggle clefFilter={clefFilter} onChange={setClefFilter} />
                </div>
            </header>

            <div className="scoreRow">
                <span>{score.correct} / {score.total}</span>
                {percentage !== null && <span className="pct">{percentage}%</span>}
                <button className="resetBtn" onClick={() => resetQuiz()}>Restart</button>
            </div>

            <div className="staffCard">
                <GrandStaff current={current} answered={!!answered} correct={answered === "correct"} />
            </div>

            {/* Feedback — automatic only: show what was played */}
            <div className="feedback" style={{ opacity: answered ? 1 : 0, pointerEvents: "none" }}>
                {answered === "wrong" && mode === "automatic" && (
                    <span className="wrong">✗ You played <strong>{selected}</strong></span>
                )}
            </div>

            {mode === "manual" && (
                <AnswersButtons
                    noteNames={NOTE_NAMES}
                    current={current}
                    selected={selected}
                    answered={answered}
                    onAnswer={handleAnswer}
                />
            )}

            {showMicPrompt && (
                <div className="micPrompt">
                    {micDenied ? (
                        <div className="micDenied">
                            <span className="micIcon">🎙️</span>
                            <p className="micPromptText">
                                {permission === "unsupported"
                                    ? "Your browser does not support microphone access."
                                    : "Microphone access was denied. Please allow it in your browser settings and try again."}
                            </p>
                            <button className="micBtn micBtnSecondary" onClick={() => setMode("manual")}>
                                Switch to manual mode
                            </button>
                        </div>
                    ) : (
                        <div className="micRequest">
                            <span className="micIcon">🎙️</span>
                            <p className="micPromptText">
                                Allow microphone access so the app can listen to your piano.
                            </p>
                            <button
                                className="micBtn"
                                onClick={startListening}
                                disabled={permission === "requesting"}
                            >
                                {permission === "requesting" ? "Requesting…" : "Enable microphone"}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {mode === "automatic" && permission === "granted" && (
                <div className="listeningIndicator">
                    {isListening && <span className="listeningDot" />}
                    <span>{isListening ? "Listening…" : "Ready"}</span>
                    {detectedFrequency !== null && clarity !== null && (
                        <span className="pitchDebug">
                            {Math.round(detectedFrequency)} Hz · {Math.round(clarity * 100)}%
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

NoteReaderPage.displayName = "NoteReaderPage";
