/**
 * NoteReaderPage - Main page component for the Note Reader quiz
 */

import React, { FC, useMemo, useEffect } from "react";
import { GrandStaff, AnswersButtons, MicPrompt, Header, CircleOfFifths, ListeningIndicator, Feedback } from "./components";
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
        hasPlayedFirstNote,
        markFirstNotePlayed,
    } = useQuizSettings();

    const keyAccidentals = useMemo(
        () => (mode === "automatic" ? (KEY_SIGNATURES[selectedKey] ?? []) : []),
        [mode, selectedKey],
    );

    const { generateRandomNote } = useNoteGeneration(clefFilter, keyAccidentals);
    const { current, answered, selected, advance, handleAnswer } =
        useQuizState();
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

    useEffect(() => {
        if (answered && !hasPlayedFirstNote) {
            markFirstNotePlayed();
        }
    }, [answered, hasPlayedFirstNote, markFirstNotePlayed]);

    if (!current) {
        return <div className="root">Loading...</div>;
    }

    return (
        <div className="root">
            <Header
                mode={mode}
                onModeChange={setMode}
                clefFilter={clefFilter}
                onClefChange={setClefFilter}
            />

            {mode === "automatic" && permission === "granted" && !hasPlayedFirstNote && (
                <ListeningIndicator
                    isListening={isListeningActive}
                    detectedPitch={activePitch}
                />
            )}

            <div className="staffCard">
                <GrandStaff
                    current={current}
                    answered={!!answered}
                    correct={answered === "correct"}
                    keyAccidentals={keyAccidentals}
                />
            </div>

            {mode === "automatic" && (
                <div className="circleOfFifthsContainer">
                    <CircleOfFifths
                        selectedKey={selectedKey}
                        onKeySelect={setSelectedKey}
                    />
                </div>
            )}

            <Feedback
                answered={answered}
                mode={mode}
                selected={selected}
            />

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
