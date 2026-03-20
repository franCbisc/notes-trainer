/**
 * NoteReaderPage - Main page component for the Note Reader quiz
 */

import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { GrandStaff, AnswersButtons, SettingsPanel } from "./components";
import { useNoteGeneration, useQuizState, usePitchDetection } from "./hooks";
import { NOTE_NAMES, KEY_SIGNATURES } from "./constants";
import { ClefFilter } from "./types";
import "../../style.css";

export const NoteReaderPage: FC = () => {
    const [clefFilter, setClefFilter] = useState<ClefFilter>("both");
    const [selectedKey, setSelectedKey] = useState<string>("Do");
    const [mode, setMode] = useState<"manual" | "automatic">("manual");
    const [settingsOpen, setSettingsOpen] = useState(false);
    const settingsBtnRef = useRef<HTMLButtonElement>(null);

    const keyAccidentals = useMemo(
        () => (mode === "automatic" ? (KEY_SIGNATURES[selectedKey] ?? []) : []),
        [mode, selectedKey],
    );

    const { generateRandomNote } = useNoteGeneration(clefFilter, keyAccidentals);
    const { current, answered, selected, advance, handleAnswer } =
        useQuizState(generateRandomNote);
    const { detectedPitch, isListening, permission, startListening, stopListening, consumeNote } =
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

    // When the key changes, pick a fresh note so the displayed note reflects the new key
    useEffect(() => {
        advance(generateRandomNote());
    }, [selectedKey]); // eslint-disable-line react-hooks/exhaustive-deps

    // Handle mode changes
    useEffect(() => {
        if (mode === "automatic") {
            startListening();
        } else {
            stopListening();
        }
        // Re-generate so the note name reflects the new mode's key context
        advance(generateRandomNote());
    }, [mode]); // eslint-disable-line react-hooks/exhaustive-deps

    // Automatic mode: feed each detected note into the quiz.
    useEffect(() => {
        if (mode === "automatic" && detectedPitch && !answered) {
            handleAnswer(detectedPitch.note, detectedPitch.midi);
            consumeNote();
        }
    }, [mode, detectedPitch, answered, handleAnswer, consumeNote]);

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
                <div className="settingsAnchor">
                    <button
                        ref={settingsBtnRef}
                        className={`settingsBtn${settingsOpen ? " settingsBtnActive" : ""}`}
                        onClick={() => setSettingsOpen((o) => !o)}
                        aria-label="Settings"
                        aria-expanded={settingsOpen}
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                            <rect x="2" y="4"  width="16" height="2" rx="1" fill="currentColor"/>
                            <rect x="2" y="9"  width="16" height="2" rx="1" fill="currentColor"/>
                            <rect x="2" y="14" width="16" height="2" rx="1" fill="currentColor"/>
                        </svg>
                    </button>
                    <SettingsPanel
                        open={settingsOpen}
                        onClose={() => setSettingsOpen(false)}
                        mode={mode}
                        onModeChange={(m) => { setMode(m); setSettingsOpen(false); }}
                        clefFilter={clefFilter}
                        onClefChange={setClefFilter}
                        selectedKey={selectedKey}
                        onKeyChange={setSelectedKey}
                    />
                </div>
                <h1 className="title">Notes trainer</h1>
                <div className="headerSpacer" aria-hidden="true" />
            </header>

            {mode === "automatic" && permission === "granted" && (
                <div className="listeningIndicator">
                    {isListening && <span className="listeningDot" />}
                    <span>{isListening ? "Listening…" : "Ready"}</span>
                    {detectedPitch && (
                        <span className="pitchDebug">
                            {Math.round(detectedPitch.frequency)} Hz · {Math.round(detectedPitch.clarity * 100)}%
                        </span>
                    )}
                </div>
            )}

            <div className="staffCard">
                <GrandStaff
                    current={current}
                    answered={!!answered}
                    correct={answered === "correct"}
                    keyAccidentals={keyAccidentals}
                />
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

        </div>
    );
};

NoteReaderPage.displayName = "NoteReaderPage";
