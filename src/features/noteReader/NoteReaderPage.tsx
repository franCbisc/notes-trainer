/**
 * NoteReaderPage - Main page component for the Note Reader quiz
 */

import React, { FC, useMemo } from "react";
import { GrandStaff, AnswersButtons, MicPrompt, Header } from "./components";
import {
    useNoteGeneration,
    useQuizState,
    usePitchDetection,
    useQuizSettings,
    useAutomaticMode,
    useQuizLifecycle,
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
        toggleSettings,
        closeSettings,
        handleModeChange,
    } = useQuizSettings();

    const keyAccidentals = useMemo(
        () => (mode === "automatic" ? (KEY_SIGNATURES[selectedKey] ?? []) : []),
        [mode, selectedKey],
    );

    const { generateRandomNote } = useNoteGeneration(clefFilter, keyAccidentals);
    const { current, answered, selected, advance, handleAnswer } =
        useQuizState(generateRandomNote);
    const { detectedPitch, permission, startListening, stopListening, consumeNote } =
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

    useQuizLifecycle({
        current,
        answered,
        advance,
        generateRandomNote,
        clefFilter,
        selectedKey,
        mode,
    });

    if (!current) {
        return <div className="root">Loading...</div>;
    }

    return (
        <div className="root">
            <Header
                settingsOpen={settingsOpen}
                onSettingsToggle={toggleSettings}
                onSettingsClose={closeSettings}
                mode={mode}
                onModeChange={handleModeChange}
                clefFilter={clefFilter}
                onClefChange={setClefFilter}
                selectedKey={selectedKey}
                onKeyChange={setSelectedKey}
            />

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
