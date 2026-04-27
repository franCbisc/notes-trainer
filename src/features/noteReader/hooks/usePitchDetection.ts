/**
 * Hook for real-time pitch detection using the Web Audio API and pitchy (MPM).
 *
 * Model: a state machine with three explicit states:
 *
 *   IDLE
 *     → stable note detected
 *   EMITTED
 *     → consumer calls consumeNote()
 *   WAITING_FOR_SILENCE
 *     → audio signal drops below threshold for N frames
 *   IDLE  (ready for next note)
 *
 * The consumer drives the EMITTED → WAITING_FOR_SILENCE transition, not the
 * audio signal. The detector will never re-fire until:
 *   1. The parent explicitly acknowledges the note via consumeNote()
 *   2. AND the piano string has actually stopped ringing (genuine silence)
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { PitchDetector } from "pitchy";
import { useMicrophone } from "./useMicrophone";
import {
    frequencyToNoteWithMidi,
    isPianoFrequency,
    MIN_CLARITY,
    MIN_VOLUME_DB,
} from "../utils/pitchUtils";
import {
    BUFFER_SIZE,
    STABLE_FRAMES,
    SILENCE_FRAMES_TO_REARM,
    OCTAVE_HISTORY_SIZE,
    A4_FREQUENCY,
    A4_MIDI_NUMBER,
    SEMITONES_PER_OCTAVE,
} from "./pitchDetectionConstants";
import { DETECTION_INTERVAL_MS } from "../timing";
import type { UsePitchDetectionReturn, DetectedPitch } from "../types";

// ─── STATE MACHINE ────────────────────────────────────────────────────────────
type DetectorState = "IDLE" | "EMITTED" | "WAITING_FOR_SILENCE";

function median(arr: number[]): number {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0
        ? sorted[mid]
        : (sorted[mid - 1] + sorted[mid]) / 2;
}

function correctOctaveError(candidateMidi: number, history: number[]): number {
    if (history.length < 3) return candidateMidi;
    const med = median(history);
    if (Math.abs(candidateMidi - med) === SEMITONES_PER_OCTAVE) {
        return candidateMidi > med ? candidateMidi - SEMITONES_PER_OCTAVE : candidateMidi + SEMITONES_PER_OCTAVE;
    }
    return candidateMidi;
}

export function usePitchDetection(): UsePitchDetectionReturn {
    const { permission, audioContext, mediaStream, requestMic, releaseMic } =
        useMicrophone();

    const [isListening, setIsListening] = useState(false);
    const [detectedPitch, setDetectedPitch] = useState<DetectedPitch | null>(null);

    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const detectorRef = useRef<PitchDetector<Float32Array> | null>(null);
    const inputBufferRef = useRef<Float32Array | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const stateRef = useRef<DetectorState>("IDLE");
    const candidateNoteRef = useRef<string | null>(null);
    const candidateFramesRef = useRef<number>(0);
    const silenceFramesRef = useRef<number>(0);
    const midiHistoryRef = useRef<number[]>([]);

    // ── Teardown ──────────────────────────────────────────────────────────────
    const teardown = useCallback(() => {
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        sourceRef.current?.disconnect();
        sourceRef.current = null;
        analyserRef.current = null;
        detectorRef.current = null;
        inputBufferRef.current = null;

        stateRef.current = "IDLE";
        candidateNoteRef.current = null;
        candidateFramesRef.current = 0;
        silenceFramesRef.current = 0;
        midiHistoryRef.current = [];

        setIsListening(false);
        setDetectedPitch(null);
    }, []);

    // ── consumeNote — parent calls this after handling the emitted note ────────
    const consumeNote = useCallback(() => {
        if (stateRef.current !== "EMITTED") return;
        stateRef.current = "WAITING_FOR_SILENCE";
        silenceFramesRef.current = 0;
        candidateNoteRef.current = null;
        candidateFramesRef.current = 0;
        setDetectedPitch(null);
    }, []);

    // ── Detection loop ────────────────────────────────────────────────────────
    const startDetectionLoop = useCallback(
        (
            analyser: AnalyserNode,
            detector: PitchDetector<Float32Array>,
            buffer: Float32Array,
            sampleRate: number,
        ) => {
            intervalRef.current = setInterval(() => {
                analyser.getFloatTimeDomainData(
                    buffer as unknown as Float32Array<ArrayBuffer>,
                );
                const [freq, cl] = detector.findPitch(buffer, sampleRate);
                const isValid = cl >= MIN_CLARITY && isPianoFrequency(freq);

                switch (stateRef.current) {

                    // ── IDLE: looking for a stable new note ───────────────────
                    case "IDLE": {
                        if (!isValid) {
                            candidateNoteRef.current = null;
                            candidateFramesRef.current = 0;
                            break;
                        }

                        const raw = frequencyToNoteWithMidi(freq);
                        if (!raw) break;

                        const correctedMidi = correctOctaveError(
                            raw.midi,
                            midiHistoryRef.current,
                        );
                        midiHistoryRef.current = [
                            ...midiHistoryRef.current.slice(-(OCTAVE_HISTORY_SIZE - 1)),
                            correctedMidi,
                        ];

                        const correctedFreqName = frequencyToNoteWithMidi(
                            A4_FREQUENCY * Math.pow(2, (correctedMidi - A4_MIDI_NUMBER) / SEMITONES_PER_OCTAVE),
                        )?.name;
                        const note = correctedMidi === raw.midi
                            ? raw.name
                            : (correctedFreqName ?? raw.name);

                        if (note === candidateNoteRef.current) {
                            candidateFramesRef.current += 1;
                        } else {
                            candidateNoteRef.current = note;
                            candidateFramesRef.current = 1;
                        }

                        if (candidateFramesRef.current >= STABLE_FRAMES) {
                            stateRef.current = "EMITTED";
                            setDetectedPitch({ note, midi: correctedMidi, frequency: freq, clarity: cl });
                        }
                        break;
                    }

                    // ── EMITTED: waiting for parent to call consumeNote() ─────
                    case "EMITTED": {
                        // Do nothing — the parent is in control here.
                        break;
                    }

                    // ── WAITING_FOR_SILENCE: note consumed, waiting for quiet ──
                    case "WAITING_FOR_SILENCE": {
                        if (!isValid) {
                            silenceFramesRef.current += 1;
                            if (silenceFramesRef.current >= SILENCE_FRAMES_TO_REARM) {
                                stateRef.current = "IDLE";
                                silenceFramesRef.current = 0;
                                midiHistoryRef.current = [];
                            }
                        } else {
                            // String still ringing — keep waiting
                            silenceFramesRef.current = 0;
                        }
                        break;
                    }
                }
            }, DETECTION_INTERVAL_MS);
        },
        [],
    );

    // ── Build audio graph once mic is granted ─────────────────────────────────
    useEffect(() => {
        if (!isListening || !audioContext || !mediaStream) return;

        const analyser = audioContext.createAnalyser();
        analyser.fftSize = BUFFER_SIZE;

        const source = audioContext.createMediaStreamSource(mediaStream);
        source.connect(analyser);

        const detector = PitchDetector.forFloat32Array(analyser.fftSize);
        detector.minVolumeDecibels = MIN_VOLUME_DB;

        const inputBuffer = new Float32Array(detector.inputLength);

        analyserRef.current = analyser;
        sourceRef.current = source;
        detectorRef.current = detector;
        inputBufferRef.current = inputBuffer;

        startDetectionLoop(analyser, detector, inputBuffer, audioContext.sampleRate);

        return () => {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            source.disconnect();
        };
    }, [isListening, audioContext, mediaStream, startDetectionLoop]);

    const startListening = useCallback(async () => {
        await requestMic();
        setIsListening(true);
    }, [requestMic]);

    const stopListening = useCallback(() => {
        teardown();
        releaseMic();
    }, [teardown, releaseMic]);

    return {
        detectedPitch,
        isListening,
        permission,
        startListening,
        stopListening,
        consumeNote,
    };
}
