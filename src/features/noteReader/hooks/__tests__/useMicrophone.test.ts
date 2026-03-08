/**
 * Tests for useMicrophone hook.
 *
 * All browser APIs (getUserMedia, AudioContext) are mocked so that tests
 * run deterministically in jsdom.
 */

import { act, renderHook } from "@testing-library/react";
import { useMicrophone } from "../useMicrophone";

// ─── Mock AudioContext ─────────────────────────────────────────────────────────
const mockClose = jest.fn().mockResolvedValue(undefined);

class MockAudioContext {
    close = mockClose;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function buildMockStream(): MediaStream {
    const mockStop = jest.fn();
    return {
        getTracks: () => [{ stop: mockStop }],
    } as unknown as MediaStream;
}

describe("useMicrophone", () => {
    let originalGetUserMedia: typeof navigator.mediaDevices.getUserMedia | undefined;

    beforeAll(() => {
        // Stub AudioContext globally
        (global as unknown as Record<string, unknown>)["AudioContext"] = MockAudioContext;
    });

    beforeEach(() => {
        jest.clearAllMocks();

        // Save and restore navigator.mediaDevices.getUserMedia
        if (navigator.mediaDevices) {
            originalGetUserMedia = navigator.mediaDevices.getUserMedia;
        }
    });

    afterEach(() => {
        if (navigator.mediaDevices && originalGetUserMedia) {
            navigator.mediaDevices.getUserMedia = originalGetUserMedia;
        }
    });

    it("initial state: permission is idle, no audioContext, no mediaStream", () => {
        const { result } = renderHook(() => useMicrophone());

        expect(result.current.permission).toBe("idle");
        expect(result.current.audioContext).toBeNull();
        expect(result.current.mediaStream).toBeNull();
    });

    it("sets permission to 'unsupported' when getUserMedia is not available", async () => {
        // Simulate no mediaDevices support
        const originalMediaDevices = navigator.mediaDevices;
        Object.defineProperty(navigator, "mediaDevices", { value: undefined, configurable: true });

        const { result } = renderHook(() => useMicrophone());

        await act(async () => {
            await result.current.requestMic();
        });

        expect(result.current.permission).toBe("unsupported");

        // Restore
        Object.defineProperty(navigator, "mediaDevices", { value: originalMediaDevices, configurable: true });
    });

    it("sets permission to 'requesting' briefly, then 'granted' on success", async () => {
        const stream = buildMockStream();
        Object.defineProperty(navigator, "mediaDevices", {
            value: { getUserMedia: jest.fn().mockResolvedValue(stream) },
            configurable: true,
        });

        const { result } = renderHook(() => useMicrophone());

        await act(async () => {
            await result.current.requestMic();
        });

        expect(result.current.permission).toBe("granted");
        expect(result.current.mediaStream).toBe(stream);
        expect(result.current.audioContext).toBeInstanceOf(MockAudioContext);
    });

    it("sets permission to 'denied' when getUserMedia throws", async () => {
        Object.defineProperty(navigator, "mediaDevices", {
            value: { getUserMedia: jest.fn().mockRejectedValue(new Error("Permission denied")) },
            configurable: true,
        });

        const { result } = renderHook(() => useMicrophone());

        await act(async () => {
            await result.current.requestMic();
        });

        expect(result.current.permission).toBe("denied");
        expect(result.current.audioContext).toBeNull();
        expect(result.current.mediaStream).toBeNull();
    });

    it("releaseMic stops all tracks and closes the AudioContext", async () => {
        const mockStop = jest.fn();
        const stream = { getTracks: () => [{ stop: mockStop }] } as unknown as MediaStream;

        Object.defineProperty(navigator, "mediaDevices", {
            value: { getUserMedia: jest.fn().mockResolvedValue(stream) },
            configurable: true,
        });

        const { result } = renderHook(() => useMicrophone());

        await act(async () => {
            await result.current.requestMic();
        });

        act(() => {
            result.current.releaseMic();
        });

        expect(mockStop).toHaveBeenCalledTimes(1);
        expect(mockClose).toHaveBeenCalledTimes(1);
        expect(result.current.audioContext).toBeNull();
        expect(result.current.mediaStream).toBeNull();
    });

    it("releaseMic is safe to call when no stream is active", () => {
        const { result } = renderHook(() => useMicrophone());

        expect(() => {
            act(() => {
                result.current.releaseMic();
            });
        }).not.toThrow();
    });

    it("calls releaseMic on unmount", async () => {
        const mockStop = jest.fn();
        const stream = { getTracks: () => [{ stop: mockStop }] } as unknown as MediaStream;

        Object.defineProperty(navigator, "mediaDevices", {
            value: { getUserMedia: jest.fn().mockResolvedValue(stream) },
            configurable: true,
        });

        const { result, unmount } = renderHook(() => useMicrophone());

        await act(async () => {
            await result.current.requestMic();
        });

        unmount();

        expect(mockStop).toHaveBeenCalledTimes(1);
    });
});

