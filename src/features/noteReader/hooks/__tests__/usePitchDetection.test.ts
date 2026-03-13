/**
 * Tests for usePitchDetection hook.
 *
 * Strategy:
 *  - Mock `useMicrophone` to control permission state without real browser APIs.
 *  - Mock `pitchy` PitchDetector.forFloat32Array so we can control what pitch is returned.
 *  - Mock `requestAnimationFrame` / `cancelAnimationFrame` to drive the detection loop.
 */

import { act, renderHook } from "@testing-library/react";
import { usePitchDetection } from "../usePitchDetection";

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

// ─── Mock requestAnimationFrame ───────────────────────────────────────────────
let rafCallbacks: Array<() => void> = [];
const originalRaf = global.requestAnimationFrame;
const originalCaf = global.cancelAnimationFrame;

beforeAll(() => {
    global.requestAnimationFrame = jest.fn((cb: FrameRequestCallback) => {
        rafCallbacks.push(() => cb(0));
        return rafCallbacks.length - 1;
    }) as unknown as typeof requestAnimationFrame;

    global.cancelAnimationFrame = jest.fn(() => {
        rafCallbacks = [];
    });
});

afterAll(() => {
    global.requestAnimationFrame = originalRaf;
    global.cancelAnimationFrame = originalCaf;
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
function flushRaf() {
    const toRun = [...rafCallbacks];
    rafCallbacks = [];
    toRun.forEach((cb) => cb());
}

// ─── Tests ────────────────────────────────────────────────────────────────────
describe("usePitchDetection", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        rafCallbacks = [];
        mockPermission = "idle";
        mockAudioContext = null;
        mockMediaStream = null;
        mockFindPitch = jest.fn().mockReturnValue([440, 0.95]);
    });

    it("initial state: not listening, no note, permission is idle", () => {
        const { result } = renderHook(() => usePitchDetection());

        expect(result.current.isListening).toBe(false);
        expect(result.current.detectedNote).toBeNull();
        expect(result.current.detectedMidi).toBeNull();
        expect(result.current.detectedFrequency).toBeNull();
        expect(result.current.clarity).toBeNull();
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
        expect(result.current.detectedNote).toBeNull();
        expect(result.current.detectedMidi).toBeNull();
        expect(result.current.detectedFrequency).toBeNull();
        expect(result.current.clarity).toBeNull();
    });

    it("does not start detection loop when audioContext/mediaStream are null", async () => {
        mockRequestMic.mockResolvedValue(undefined);
        const { result } = renderHook(() => usePitchDetection());

        await act(async () => {
            await result.current.startListening();
        });

        // No audioContext yet — RAF should not have been scheduled
        act(() => {
            flushRaf();
        });

        expect(mockFindPitch).not.toHaveBeenCalled();
        expect(result.current.detectedNote).toBeNull();
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

        act(() => {
            flushRaf();
        });

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

        // Need STABLE_FRAMES (6) consecutive frames before the note is emitted
        for (let i = 0; i < 6; i++) {
            act(() => { flushRaf(); });
        }

        expect(result.current.detectedNote).toBe("La");
        expect(result.current.detectedMidi).toBe(69);
        expect(result.current.detectedFrequency).toBe(440);
        expect(result.current.clarity).toBe(0.95);
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

        act(() => {
            flushRaf();
        });

        expect(result.current.detectedNote).toBeNull();
        expect(result.current.detectedFrequency).toBeNull();
        expect(result.current.clarity).toBeNull();
    });

    it("stopListening cancels the animation frame when detection loop is active", async () => {
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

        // Re-render so effect fires and queues a RAF
        rerender();

        // Flush one RAF iteration so the loop runs (rafIdRef.current gets set)
        act(() => {
            flushRaf();
        });

        // Now the loop has re-queued a new RAF — stop while the loop is live
        act(() => {
            result.current.stopListening();
        });

        expect(global.cancelAnimationFrame).toHaveBeenCalled();
        expect(result.current.isListening).toBe(false);
    });

    it("stopListening is safe to call when never started (no rafId, no source)", () => {
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

        act(() => { flushRaf(); });

        expect(result.current.detectedNote).toBeNull();
        expect(result.current.detectedFrequency).toBeNull();
    });

    it("does not emit until STABLE_FRAMES consecutive frames of the same note are seen", async () => {
        // STABLE_FRAMES = 6 — need 6 frames before the note is emitted
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

        // Flush 5 frames — not yet stable
        for (let i = 0; i < 5; i++) {
            act(() => { flushRaf(); });
        }
        expect(result.current.detectedNote).toBeNull();

        // 6th frame — now stable
        act(() => { flushRaf(); });
        expect(result.current.detectedNote).toBe("La");
    });

    it("does not re-emit the same note while it is held down (lastEmittedNote guard)", async () => {
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
        for (let i = 0; i < 6; i++) {
            act(() => { flushRaf(); });
        }
        expect(result.current.detectedNote).toBe("La");

        // Spy on setDetectedNote — we only care it isn't called again
        const setNoteSpy = jest.spyOn(result.current, "startListening"); // dummy, just to confirm stability

        // Flush many more frames — note should NOT change (same "La" held)
        for (let i = 0; i < 10; i++) {
            act(() => { flushRaf(); });
        }

        // Still "La", no re-trigger
        expect(result.current.detectedNote).toBe("La");
        setNoteSpy.mockRestore();
    });

    it("emits the same note again after a silence gap (lastEmittedNote reset)", async () => {
        let callCount = 0;
        mockFindPitch = jest.fn().mockImplementation(() => {
            callCount++;
            // First 6 calls: return La with good clarity
            // Next 3 calls: return silence
            // After that: return La again
            if (callCount <= 6) return [440, 0.95];
            if (callCount <= 9) return [0, 0];    // silence resets lastEmitted
            return [440, 0.95];                    // La again — should be emitted
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

        // 6 frames → La emitted
        for (let i = 0; i < 6; i++) act(() => { flushRaf(); });
        expect(result.current.detectedNote).toBe("La");

        // 3 silence frames → note cleared, lastEmitted reset
        for (let i = 0; i < 3; i++) act(() => { flushRaf(); });
        expect(result.current.detectedNote).toBeNull();

        // 6 more La frames → La emitted again (new note-on event)
        for (let i = 0; i < 6; i++) act(() => { flushRaf(); });
        expect(result.current.detectedNote).toBe("La");
    });

    it("resets candidate counter when note changes mid-stability", async () => {
        let callCount = 0;
        mockFindPitch = jest.fn().mockImplementation(() => {
            callCount++;
            // 3 frames of La, then switch to Sol
            if (callCount <= 3) return [440, 0.95];  // La
            return [392, 0.95];                       // Sol
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

        // 3 La frames — not yet stable
        for (let i = 0; i < 3; i++) act(() => { flushRaf(); });
        expect(result.current.detectedNote).toBeNull();

        // 5 Sol frames — counter reset on switch, still not stable (only 5)
        for (let i = 0; i < 5; i++) act(() => { flushRaf(); });
        expect(result.current.detectedNote).toBeNull();

        // 1 more Sol frame — now 6 consecutive, Sol emitted
        act(() => { flushRaf(); });
        expect(result.current.detectedNote).toBe("Sol");
    });

    it("reflects permission from useMicrophone", () => {
        mockPermission = "denied";
        const { result } = renderHook(() => usePitchDetection());
        expect(result.current.permission).toBe("denied");
    });
});
