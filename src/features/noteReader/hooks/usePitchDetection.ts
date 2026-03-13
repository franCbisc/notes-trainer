/**
 * Hook for real-time pitch detection using the Web Audio API and pitchy (MPM algorithm).
 *
 * Flow:
 *   1. Consumer calls startListening() → requestMic() is called internally.
 *   2. Browser shows the permission prompt.
 *   3. On grant, an AnalyserNode is connected to the mic stream.
 *   4. A requestAnimationFrame loop reads PCM samples, feeds them to pitchy's
 *      PitchDetector and converts the detected frequency to an Italian note name.
 *   5. stopListening() tears everything down and releases the microphone.
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { PitchDetector } from "pitchy";
import { useMicrophone } from "./useMicrophone";
import { frequencyToNoteWithMidi, isPianoFrequency, MIN_CLARITY, MIN_VOLUME_DB } from "../utils/pitchUtils";

/** Size of the FFT / analysis buffer.  Must be a power of 2. */
const BUFFER_SIZE = 4096;

/**
 * Number of consecutive frames the same note must appear before it is emitted.
 * At 60 fps this is ~100 ms — long enough to ignore transient harmonics but
 * short enough to feel responsive on a piano attack.
 */
const STABLE_FRAMES = 6;

export interface UsePitchDetectionReturn {
    detectedNote: string | null;
    detectedMidi: number | null;
    detectedFrequency: number | null;
    clarity: number | null;
    isListening: boolean;
    permission: ReturnType<typeof useMicrophone>["permission"];
    startListening: () => Promise<void>;
    stopListening: () => void;
}

export function usePitchDetection(): UsePitchDetectionReturn {
    const { permission, audioContext, mediaStream, requestMic, releaseMic } = useMicrophone();

    const [isListening, setIsListening] = useState(false);
    const [detectedNote, setDetectedNote] = useState<string | null>(null);
    const [detectedMidi, setDetectedMidi] = useState<number | null>(null);
    const [detectedFrequency, setDetectedFrequency] = useState<number | null>(null);
    const [clarity, setClarity] = useState<number | null>(null);

    // Refs for the audio graph and animation loop
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const detectorRef = useRef<PitchDetector<Float32Array> | null>(null);
    const inputBufferRef = useRef<Float32Array | null>(null);
    const rafIdRef = useRef<number | null>(null);

    /** Candidate note accumulator for stability debounce. */
    const candidateNoteRef = useRef<string | null>(null);
    const candidateFramesRef = useRef<number>(0);
    /** The last note that was actually emitted (to suppress repeated triggers). */
    const lastEmittedNoteRef = useRef<string | null>(null);

    /** Tear down audio graph and cancel detection loop. */
    const teardown = useCallback(() => {
        if (rafIdRef.current !== null) {
            cancelAnimationFrame(rafIdRef.current);
            rafIdRef.current = null;
        }
        sourceRef.current?.disconnect();
        sourceRef.current = null;
        analyserRef.current = null;
        detectorRef.current = null;
        inputBufferRef.current = null;
        candidateNoteRef.current = null;
        candidateFramesRef.current = 0;
        lastEmittedNoteRef.current = null;
        setIsListening(false);
        setDetectedNote(null);
        setDetectedMidi(null);
        setDetectedFrequency(null);
        setClarity(null);
    }, []);

    /** Detection loop — runs every animation frame while listening. */
    const startDetectionLoop = useCallback(
        (analyser: AnalyserNode, detector: PitchDetector<Float32Array>, buffer: Float32Array, sampleRate: number) => {
            const loop = () => {
                analyser.getFloatTimeDomainData(buffer as unknown as Float32Array<ArrayBuffer>);
                const [freq, cl] = detector.findPitch(buffer, sampleRate);

                const isValid = cl >= MIN_CLARITY && isPianoFrequency(freq);

                if (isValid) {
                    // isPianoFrequency already guarantees freq maps to a valid MIDI
                    // so frequencyToNoteWithMidi is never null here.
                    const { name: note, midi } = frequencyToNoteWithMidi(freq)!;

                    // Stability debounce: require STABLE_FRAMES consecutive frames
                    // of the same note before emitting it, and only emit once per
                    // note-on event (suppress while the same note is held down).
                    if (note === candidateNoteRef.current) {
                        candidateFramesRef.current += 1;
                    } else {
                        candidateNoteRef.current = note;
                        candidateFramesRef.current = 1;
                    }

                    if (candidateFramesRef.current >= STABLE_FRAMES && note !== lastEmittedNoteRef.current) {
                        lastEmittedNoteRef.current = note;
                        console.debug(`[pitch] ${freq.toFixed(2)} Hz → ${note} MIDI ${midi} (clarity: ${(cl * 100).toFixed(1)}%)`);
                        setDetectedFrequency(freq);
                        setClarity(cl);
                        setDetectedMidi(midi);
                        setDetectedNote(note);
                    }
                } else {
                    // Silence or non-piano sound: reset candidate and allow the
                    // same note to be detected again next time the key is pressed.
                    candidateNoteRef.current = null;
                    candidateFramesRef.current = 0;
                    lastEmittedNoteRef.current = null;
                    setDetectedFrequency(null);
                    setClarity(null);
                    setDetectedMidi(null);
                    setDetectedNote(null);
                }

                rafIdRef.current = requestAnimationFrame(loop);
            };

            rafIdRef.current = requestAnimationFrame(loop);
        },
        []
    );

    /** Build the audio graph once we have a granted mic + AudioContext. */
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
            if (rafIdRef.current !== null) {
                cancelAnimationFrame(rafIdRef.current);
                rafIdRef.current = null;
            }
            source.disconnect();
        };
    }, [isListening, audioContext, mediaStream, startDetectionLoop]);

    const startListening = useCallback(async () => {
        await requestMic();
        // isListening is set to true only after permission is granted —
        // the effect above will react to the audioContext/mediaStream change.
        setIsListening(true);
    }, [requestMic]);

    const stopListening = useCallback(() => {
        teardown();
        releaseMic();
    }, [teardown, releaseMic]);

    return {
        detectedNote,
        detectedMidi,
        detectedFrequency,
        clarity,
        isListening,
        permission,
        startListening,
        stopListening,
    };
}
