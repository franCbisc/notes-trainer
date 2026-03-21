/**
 * NoteReaderPage - Main page component for the Note Reader quiz
 */

import React, { FC, useEffect, useMemo } from "react";
import { GrandStaff, AnswersButtons, SettingsPanel, SettingsIcon, MicPrompt } from "./components";
import {
    useNoteGeneration,
    useQuizState,
    usePitchDetection,
    useQuizSettings,
    useAutomaticMode,
} from "./hooks";
import { NOTE_NAMES, KEY_SIGNATURES } from "./constants";
import "../../style.css";

export const NoteReaderPage: FC = () => {
    const {
        clefFilter,
        setClefFilter,
        selectedKey,
        setSelectedKey,
        mode,
        setMode,
        settingsOpen,
        setSettingsOpen,
        settingsBtnRef,
    } = useQuizSettings();

    const keyAccidentals = useMemo(
        () => (mode === "automatic" ? (KEY_SIGNATURES[selectedKey] ?? []) : []),
        [mode, selectedKey],
    );

    const { generateRandomNote } = useNoteGeneration(clefFilter, keyAccidentals);
    const { current, answered, selected, advance, handleAnswer } =
        useQuizState(generateRandomNote);
    const { detectedPitch, isListening, permission, startListening, stopListening, consumeNote } =
        usePitchDetection();

    const {
        isListening: isListeningActive,
        detectedPitch: activePitch,
        showMicPrompt,
    } = useAutomaticMode({
        mode,
        permission,
        detectedPitch,
        answered,
        onAnswer: handleAnswer,
        onConsumeNote: consumeNote,
        onStartListening: startListening,
        onStopListening: stopListening,
    });

    useEffect(() => {
        if (!current) {
            advance(generateRandomNote());
        }
    }, [current, advance, generateRandomNote]);

    useEffect(() => {
        advance(generateRandomNote());
    }, [clefFilter]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        advance(generateRandomNote());
    }, [selectedKey]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        advance(generateRandomNote());
    }, [mode]); // eslint-disable-line react-hooks/exhaustive-deps

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
                        <SettingsIcon />
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
                    {isListeningActive && <span className="listeningDot" />}
                    <span>{isListeningActive ? "Listening…" : "Ready"}</span>
                    {activePitch && (
                        <span className="pitchDebug">
                            {Math.round(activePitch.frequency)} Hz · {Math.round(activePitch.clarity * 100)}%
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
                <MicPrompt
                    permission={permission}
                    onStartListening={startListening}
                    onSwitchToManual={() => setMode("manual")}
                />
            )}
        </div>
    );
};

NoteReaderPage.displayName = "NoteReaderPage";
