import { act, renderHook } from "@testing-library/react";
import { usePitchDetection } from "../usePitchDetection";
import {
    DETECTION_INTERVAL_MS,
    STABLE_FRAMES,
    SILENCE_FRAMES_TO_REARM,
} from "../pitchDetectionConstants";

// ─── Mock pitchUtils (use real implementations, but allow per-test overrides) ─
let forceFrequencyToNoteNull = false;
let forceFrequencyToNoteNullForCorrected = false;
let correctedFreqToReturnNull: number | null = null;

jest.mock("../../utils/pitchUtils", () => {
    const real = jest.requireActual<typeof import("../../utils/pitchUtils")>(
        "../../utils/pitchUtils",
    );
    return {
        ...real,
        frequencyToNoteWithMidi: (freq: number) => {
            if (forceFrequencyToNoteNull) return null;
            if (forceFrequencyToNoteNullForCorrected && freq !== 440 && freq !== 880) return null;
            if (correctedFreqToReturnNull !== null && Math.abs(freq - correctedFreqToReturnNull) < 1) return null;
            return real.frequencyToNoteWithMidi(freq);
        },
    };
});

// ─── Mock useMicrophone ────────────────────────────────────────────────────────
const mockRequestMic = jest.fn();
const mockReleaseMic = jest.fn();
let mockPermission: string = "idle";
let mockAudioContext: unknown = null;
let mockMediaStream: unknown = null;

jest.mock("../useMicrophone", () => ({
    useMicrophone: () => ({
        permission: mockPermission,
        audioContext: mockAudioContext,
        mediaStream: mockMediaStream,
        requestMic: mockRequestMic,
        releaseMic: mockReleaseMic,
    }),
}));

// ─── Mock pitchy ──────────────────────────────────────────────────────────────
let mockFindPitch: jest.Mock = jest.fn().mockReturnValue([440, 0.95]);

jest.mock("pitchy", () => ({
    PitchDetector: {
        forFloat32Array: jest.fn(() => ({
            findPitch: (...args: unknown[]) => mockFindPitch(...args),
            set minVolumeDecibels(_: number) {},
            get inputLength() {
                return 4096;
            },
        })),
    },
}));

// ─── Mock Web Audio API ───────────────────────────────────────────────────────
const mockGetFloatTimeDomainData = jest.fn();
const mockConnect = jest.fn();
const mockDisconnect = jest.fn();
const mockCreateAnalyser = jest.fn(() => ({
    fftSize: 0,
    getFloatTimeDomainData: mockGetFloatTimeDomainData,
}));
const mockCreateMediaStreamSource = jest.fn(() => ({
    connect: mockConnect,
    disconnect: mockDisconnect,
}));

function buildMockAudioContext() {
    return {
        createAnalyser: mockCreateAnalyser,
        createMediaStreamSource: mockCreateMediaStreamSource,
        sampleRate: 44100,
    };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Advance fake timers by N detection intervals (each 80 ms). */
function tickFrames(n: number) {
    for (let i = 0; i < n; i++) {
        act(() => {
            jest.advanceTimersByTime(DETECTION_INTERVAL_MS);
        });
    }
}

describe("usePitchDetection", () => {
    beforeEach(() => {
        jest.useFakeTimers();
        jest.clearAllMocks();
        forceFrequencyToNoteNull = false;
        forceFrequencyToNoteNullForCorrected = false;
        mockPermission = "idle";
        mockAudioContext = null;
        mockMediaStream = null;
        mockFindPitch = jest.fn().mockReturnValue([440, 0.95]);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("initial state: not listening, no note, permission is idle", () => {
        const { result } = renderHook(() => usePitchDetection());

        expect(result.current.isListening).toBe(false);
        expect(result.current.detectedPitch).toBeNull();
        expect(result.current.permission).toBe("idle");
    });

    it("startListening calls requestMic and sets isListening to true", async () => {
        mockRequestMic.mockResolvedValue(undefined);
        const { result } = renderHook(() => usePitchDetection());

        await act(async () => {
            await result.current.startListening();
        });

        expect(mockRequestMic).toHaveBeenCalledTimes(1);
        expect(result.current.isListening).toBe(true);
    });

    it("stopListening calls releaseMic and clears state", async () => {
        mockRequestMic.mockResolvedValue(undefined);
        const { result } = renderHook(() => usePitchDetection());

        await act(async () => {
            await result.current.startListening();
        });

        act(() => {
            result.current.stopListening();
        });

        expect(mockReleaseMic).toHaveBeenCalledTimes(1);
        expect(result.current.isListening).toBe(false);
        expect(result.current.detectedPitch).toBeNull();
    });

    it("does not start detection loop when audioContext/mediaStream are null", async () => {
        mockRequestMic.mockResolvedValue(undefined);
        const { result } = renderHook(() => usePitchDetection());

        await act(async () => {
            await result.current.startListening();
        });

        // No audioContext yet — interval should not have been scheduled
        tickFrames(1);

        expect(mockFindPitch).not.toHaveBeenCalled();
        expect(result.current.detectedPitch).toBeNull();
    });

    it("starts detection loop when audioContext and mediaStream are available", async () => {
        mockRequestMic.mockImplementation(async () => {
            mockPermission = "granted";
            mockAudioContext = buildMockAudioContext();
            mockMediaStream = { getTracks: () => [] };
        });

        const { result, rerender } = renderHook(() => usePitchDetection());

        await act(async () => {
            await result.current.startListening();
        });

        // Re-render so the effect sees the updated audioContext/mediaStream from mock
        rerender();

        tickFrames(1);

        expect(mockFindPitch).toHaveBeenCalledTimes(1);
    });

    it("sets detectedNote, frequency and clarity when pitch is clear enough", async () => {
        mockFindPitch = jest.fn().mockReturnValue([440, 0.95]); // La, clarity 95%

        mockRequestMic.mockImplementation(async () => {
            mockPermission = "granted";
            mockAudioContext = buildMockAudioContext();
            mockMediaStream = { getTracks: () => [] };
        });

        const { result, rerender } = renderHook(() => usePitchDetection());

        await act(async () => {
            await result.current.startListening();
        });

        rerender();

        // Need STABLE_FRAMES consecutive frames before the note is emitted
        tickFrames(STABLE_FRAMES);

        expect(result.current.detectedPitch).toEqual({
            note: "La",
            midi: 69,
            frequency: 440,
            clarity: 0.95,
        });
    });

    it("clears note/frequency/clarity when clarity is below threshold", async () => {
        mockFindPitch = jest.fn().mockReturnValue([440, 0.5]); // low clarity

        mockRequestMic.mockImplementation(async () => {
            mockPermission = "granted";
            mockAudioContext = buildMockAudioContext();
            mockMediaStream = { getTracks: () => [] };
        });

        const { result, rerender } = renderHook(() => usePitchDetection());

        await act(async () => {
            await result.current.startListening();
        });

        rerender();

        tickFrames(1);

        expect(result.current.detectedPitch).toBeNull();
    });

    it("stopListening cancels the interval when detection loop is active", async () => {
        mockFindPitch = jest.fn().mockReturnValue([440, 0.95]);

        mockRequestMic.mockImplementation(async () => {
            mockPermission = "granted";
            mockAudioContext = buildMockAudioContext();
            mockMediaStream = { getTracks: () => [] };
        });

        const spyClearInterval = jest.spyOn(global, "clearInterval");

        const { result, rerender } = renderHook(() => usePitchDetection());

        await act(async () => {
            await result.current.startListening();
        });

        // Re-render so effect fires and starts the interval
        rerender();

        // Flush one tick so the loop runs
        tickFrames(1);

        // Now stop while the loop is live
        act(() => {
            result.current.stopListening();
        });

        expect(spyClearInterval).toHaveBeenCalled();
        expect(result.current.isListening).toBe(false);

        spyClearInterval.mockRestore();
    });

    it("stopListening is safe to call when never started (no interval, no source)", () => {
        const { result } = renderHook(() => usePitchDetection());

        expect(() => {
            act(() => {
                result.current.stopListening();
            });
        }).not.toThrow();

        expect(result.current.isListening).toBe(false);
    });

    it("does not emit when frequency is outside the piano range", async () => {
        // 20 Hz is below the piano minimum (27.5 Hz) — should be treated as invalid
        mockFindPitch = jest.fn().mockReturnValue([20, 0.95]);

        mockRequestMic.mockImplementation(async () => {
            mockPermission = "granted";
            mockAudioContext = buildMockAudioContext();
            mockMediaStream = { getTracks: () => [] };
        });

        const { result, rerender } = renderHook(() => usePitchDetection());

        await act(async () => {
            await result.current.startListening();
        });

        rerender();

        tickFrames(1);

        expect(result.current.detectedPitch).toBeNull();
    });

    it("does not emit until STABLE_FRAMES consecutive frames of the same note are seen", async () => {
        // STABLE_FRAMES = 4 — need 4 frames before the note is emitted
        mockFindPitch = jest.fn().mockReturnValue([440, 0.95]); // La

        mockRequestMic.mockImplementation(async () => {
            mockPermission = "granted";
            mockAudioContext = buildMockAudioContext();
            mockMediaStream = { getTracks: () => [] };
        });

        const { result, rerender } = renderHook(() => usePitchDetection());

        await act(async () => {
            await result.current.startListening();
        });

        rerender();

        // Flush STABLE_FRAMES-1 frames — not yet stable
        tickFrames(STABLE_FRAMES - 1);
        expect(result.current.detectedPitch).toBeNull();

        // One more frame — now stable
        tickFrames(1);
        expect(result.current.detectedPitch?.note).toBe("La");
    });

    it("does not re-emit the same note while it is held down (EMITTED state guard)", async () => {
        mockFindPitch = jest.fn().mockReturnValue([440, 0.95]); // La continuously

        mockRequestMic.mockImplementation(async () => {
            mockPermission = "granted";
            mockAudioContext = buildMockAudioContext();
            mockMediaStream = { getTracks: () => [] };
        });

        const { result, rerender } = renderHook(() => usePitchDetection());

        await act(async () => {
            await result.current.startListening();
        });

        rerender();

        // Flush enough frames to emit once
        tickFrames(STABLE_FRAMES);
        expect(result.current.detectedPitch?.note).toBe("La");

        // Flush many more frames while in EMITTED state — note must remain stable
        tickFrames(10);

        // Still "La", no re-trigger
        expect(result.current.detectedPitch?.note).toBe("La");
    });

    it("emits the same note again after consumeNote + silence gap", async () => {
        let callCount = 0;
        mockFindPitch = jest.fn().mockImplementation(() => {
            callCount++;
            // First STABLE_FRAMES calls: La with good clarity
            if (callCount <= STABLE_FRAMES) return [440, 0.95];
            // Next SILENCE_FRAMES_TO_REARM calls: silence (re-arms detector)
            if (callCount <= STABLE_FRAMES + SILENCE_FRAMES_TO_REARM) return [0, 0];
            // After that: La again — should be emitted anew
            return [440, 0.95];
        });

        mockRequestMic.mockImplementation(async () => {
            mockPermission = "granted";
            mockAudioContext = buildMockAudioContext();
            mockMediaStream = { getTracks: () => [] };
        });

        const { result, rerender } = renderHook(() => usePitchDetection());

        await act(async () => {
            await result.current.startListening();
        });

        rerender();

        // STABLE_FRAMES frames → La emitted
        tickFrames(STABLE_FRAMES);
        expect(result.current.detectedPitch?.note).toBe("La");

        // Parent acknowledges the note → WAITING_FOR_SILENCE
        act(() => {
            result.current.consumeNote();
        });
        expect(result.current.detectedPitch).toBeNull();

        // SILENCE_FRAMES_TO_REARM silence frames → re-arms (back to IDLE)
        tickFrames(SILENCE_FRAMES_TO_REARM);

        // STABLE_FRAMES more La frames → La emitted again
        tickFrames(STABLE_FRAMES);
        expect(result.current.detectedPitch?.note).toBe("La");
    });

    it("resets candidate counter when note changes mid-stability", async () => {
        let callCount = 0;
        mockFindPitch = jest.fn().mockImplementation(() => {
            callCount++;
            // STABLE_FRAMES-1 frames of La, then switch to Sol
            if (callCount <= STABLE_FRAMES - 1) return [440, 0.95];  // La
            return [392, 0.95];                                        // Sol
        });

        mockRequestMic.mockImplementation(async () => {
            mockPermission = "granted";
            mockAudioContext = buildMockAudioContext();
            mockMediaStream = { getTracks: () => [] };
        });

        const { result, rerender } = renderHook(() => usePitchDetection());

        await act(async () => {
            await result.current.startListening();
        });

        rerender();

        // STABLE_FRAMES-1 La frames — not yet stable
        tickFrames(STABLE_FRAMES - 1);
        expect(result.current.detectedPitch).toBeNull();

        // STABLE_FRAMES-1 Sol frames — counter reset on switch, still not stable
        tickFrames(STABLE_FRAMES - 1);
        expect(result.current.detectedPitch).toBeNull();

        // 1 more Sol frame — now STABLE_FRAMES consecutive, Sol emitted
        tickFrames(1);
        expect(result.current.detectedPitch?.note).toBe("Sol");
    });

    it("reflects permission from useMicrophone", () => {
        mockPermission = "denied";
        const { result } = renderHook(() => usePitchDetection());
        expect(result.current.permission).toBe("denied");
    });

    it("consumeNote is a no-op when state is not EMITTED (line 107 branch)", async () => {
        // Call consumeNote while in IDLE — it should early-return without throwing
        mockRequestMic.mockResolvedValue(undefined);
        const { result } = renderHook(() => usePitchDetection());

        await act(async () => {
            await result.current.startListening();
        });

        expect(() => {
            act(() => { result.current.consumeNote(); });
        }).not.toThrow();

        expect(result.current.isListening).toBe(true);
        expect(result.current.detectedPitch).toBeNull();
    });

    it("handles a frame where frequencyToNoteWithMidi returns null (line 145 branch)", async () => {
        // Override to return null so the `if (!raw) break` branch is taken
        forceFrequencyToNoteNull = true;

        mockFindPitch = jest.fn().mockReturnValue([440, 0.95]);
        mockRequestMic.mockImplementation(async () => {
            mockPermission = "granted";
            mockAudioContext = buildMockAudioContext();
            mockMediaStream = { getTracks: () => [] };
        });

        const { result, rerender } = renderHook(() => usePitchDetection());

        await act(async () => {
            await result.current.startListening();
        });

        rerender();

        tickFrames(1);
        expect(result.current.detectedPitch).toBeNull();
    });

    it("correctOctaveError: shifts candidateMidi DOWN when it is one octave above the history median", async () => {
        // Seed 3 frames of La4 (MIDI 69 / 440 Hz), then send La5 (MIDI 81 / 880 Hz).
        // |81-69| = 12, 81 > 69 → return 81-12 = 69, hitting the `candidateMidi - 12` branch.
        let callCount = 0;
        mockFindPitch = jest.fn().mockImplementation(() => {
            callCount++;
            if (callCount <= 3) return [440, 0.95];  // La4 — seeds history at MIDI 69
            return [880, 0.95];                       // La5 — corrected DOWN to MIDI 69
        });

        mockRequestMic.mockImplementation(async () => {
            mockPermission = "granted";
            mockAudioContext = buildMockAudioContext();
            mockMediaStream = { getTracks: () => [] };
        });

        const { result, rerender } = renderHook(() => usePitchDetection());

        await act(async () => {
            await result.current.startListening();
        });

        rerender();

        // 3 La4 frames — seeds history at MIDI 69, not yet stable
        tickFrames(3);
        expect(result.current.detectedPitch).toBeNull();

        // STABLE_FRAMES La5 (880 Hz) frames — corrected DOWN to MIDI 69
        tickFrames(STABLE_FRAMES);
        expect(result.current.detectedPitch?.midi).toBe(69);
    });

    it("uses raw.name when octave is corrected but correctedFreqName is null", async () => {
        // Seed with 440 Hz (MIDI 69), then send 880 Hz which corrects down to MIDI 69.
        // The corrected frequency for MIDI 69 is 440 Hz.
        // We set the mock to return null for 440 Hz AFTER seeding is done.
        let callCount = 0;
        mockFindPitch = jest.fn().mockImplementation(() => {
            callCount++;
            if (callCount <= 3) return [440, 0.95]; // La4 - seed with 440
            // After seed, return null for 440 Hz (the corrected frequency)
            if (callCount === 4) correctedFreqToReturnNull = 440;
            return [880, 0.95]; // La5 - corrected to MIDI 69 -> correctedFreq = 440 Hz
        });

        mockRequestMic.mockImplementation(async () => {
            mockPermission = "granted";
            mockAudioContext = buildMockAudioContext();
            mockMediaStream = { getTracks: () => [] };
        });

        const { result, rerender } = renderHook(() => usePitchDetection());

        await act(async () => {
            await result.current.startListening();
        });

        rerender();

        tickFrames(3);
        expect(result.current.detectedPitch).toBeNull();

        tickFrames(STABLE_FRAMES);
        // correctedMidi (69) !== raw.midi (81), so else branch taken
        // correctedFreqName is null (mocked), so ?? falls back to raw.name
        expect(result.current.detectedPitch?.note).toBe("La");
        expect(result.current.detectedPitch?.midi).toBe(69);

        // Cleanup
        correctedFreqToReturnNull = null;
    });

    it("uses correctedFreqName when octave is corrected and correctedFreqName is not null", async () => {
        // Seed 3 frames of La4 (MIDI 69 / 440 Hz), then send La5 (MIDI 81 / 880 Hz).
        // This triggers: correctedMidi !== raw.midi AND correctedFreqName is not null
        let callCount = 0;
        mockFindPitch = jest.fn().mockImplementation(() => {
            callCount++;
            if (callCount <= 3) return [440, 0.95];
            return [880, 0.95];
        });

        mockRequestMic.mockImplementation(async () => {
            mockPermission = "granted";
            mockAudioContext = buildMockAudioContext();
            mockMediaStream = { getTracks: () => [] };
        });

        const { result, rerender } = renderHook(() => usePitchDetection());

        await act(async () => {
            await result.current.startListening();
        });

        rerender();

        tickFrames(3);
        expect(result.current.detectedPitch).toBeNull();

        tickFrames(STABLE_FRAMES);
        // correctedMidi (69) !== raw.midi (81), so uses correctedFreqName
        expect(result.current.detectedPitch?.note).toBe("La");
        expect(result.current.detectedPitch?.midi).toBe(69);
    });

    it("correctOctaveError: shifts candidateMidi UP when it is one octave below the history median", async () => {
        // Seed 3 frames of La5 (MIDI 81 / 880 Hz), then send La4 (MIDI 69 / 440 Hz).
        // |69-81| = 12, 69 < 81 → return 69+12 = 81, hitting the `candidateMidi + 12` branch.
        let callCount = 0;
        mockFindPitch = jest.fn().mockImplementation(() => {
            callCount++;
            if (callCount <= 3) return [880, 0.95];  // La5 — seeds history at MIDI 81
            return [440, 0.95];                       // La4 — corrected UP to MIDI 81
        });

        mockRequestMic.mockImplementation(async () => {
            mockPermission = "granted";
            mockAudioContext = buildMockAudioContext();
            mockMediaStream = { getTracks: () => [] };
        });

        const { result, rerender } = renderHook(() => usePitchDetection());

        await act(async () => {
            await result.current.startListening();
        });

        rerender();

        // 3 La5 frames — seeds history at MIDI 81, not yet stable
        tickFrames(3);
        expect(result.current.detectedPitch).toBeNull();

        // STABLE_FRAMES La4 (440 Hz) frames — corrected UP to MIDI 81
        tickFrames(STABLE_FRAMES);
        expect(result.current.detectedPitch?.midi).toBe(81);
    });

    it("WAITING_FOR_SILENCE: resets silence counter when signal is still ringing after consumeNote", async () => {
        // After consumeNote the string keeps ringing (valid signal) for a few
        // frames before going silent. The detector must not re-arm until it
        // sees SILENCE_FRAMES_TO_REARM *consecutive* silent frames.
        let callCount = 0;
        mockFindPitch = jest.fn().mockImplementation(() => {
            callCount++;
            if (callCount <= STABLE_FRAMES) return [440, 0.95];                              // La → emitted
            if (callCount <= STABLE_FRAMES + 3) return [440, 0.95];                          // still ringing
            if (callCount <= STABLE_FRAMES + 3 + SILENCE_FRAMES_TO_REARM) return [0, 0];    // silence → re-arms
            return [440, 0.95];                                                               // La again
        });

        mockRequestMic.mockImplementation(async () => {
            mockPermission = "granted";
            mockAudioContext = buildMockAudioContext();
            mockMediaStream = { getTracks: () => [] };
        });

        const { result, rerender } = renderHook(() => usePitchDetection());

        await act(async () => {
            await result.current.startListening();
        });

        rerender();

        tickFrames(STABLE_FRAMES);
        expect(result.current.detectedPitch?.note).toBe("La");

        act(() => { result.current.consumeNote(); });

        // 3 ringing frames — silence counter resets each time
        tickFrames(3);
        // STABLE_FRAMES-1 more — still not re-armed (no note emitted)
        tickFrames(STABLE_FRAMES - 1);
        expect(result.current.detectedPitch).toBeNull();

        // SILENCE_FRAMES_TO_REARM silence frames → re-arms
        tickFrames(SILENCE_FRAMES_TO_REARM);

        // La emitted again
        tickFrames(STABLE_FRAMES);
        expect(result.current.detectedPitch?.note).toBe("La");
    });
});
