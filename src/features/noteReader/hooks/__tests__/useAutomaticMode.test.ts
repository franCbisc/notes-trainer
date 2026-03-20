import { act, renderHook } from "@testing-library/react";
import { useAutomaticMode } from "../useAutomaticMode";

describe("useAutomaticMode", () => {
    const createProps = (overrides = {}) => ({
        mode: "manual" as const,
        permission: "idle" as const,
        detectedPitch: null,
        answered: null,
        onAnswer: jest.fn(),
        onConsumeNote: jest.fn(),
        onStartListening: jest.fn(),
        onStopListening: jest.fn(),
        ...overrides,
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("returns correct initial values for manual mode", () => {
        const { result } = renderHook(() => useAutomaticMode(createProps()));

        expect(result.current.isListening).toBe(false);
        expect(result.current.detectedPitch).toBeNull();
        expect(result.current.showMicPrompt).toBe(false);
        expect(result.current.micDenied).toBe(false);
    });

    it("returns isListening true only when in automatic mode with granted permission", () => {
        const { result } = renderHook(() =>
            useAutomaticMode(createProps({ mode: "automatic", permission: "granted" })),
        );

        expect(result.current.isListening).toBe(true);
    });

    it("returns isListening false when permission is not granted", () => {
        const { result } = renderHook(() =>
            useAutomaticMode(createProps({ mode: "automatic", permission: "idle" })),
        );

        expect(result.current.isListening).toBe(false);
    });

    it("returns showMicPrompt true when in automatic mode without granted permission", () => {
        const { result } = renderHook(() =>
            useAutomaticMode(createProps({ mode: "automatic", permission: "idle" })),
        );

        expect(result.current.showMicPrompt).toBe(true);
    });

    it("returns showMicPrompt false when permission is granted", () => {
        const { result } = renderHook(() =>
            useAutomaticMode(createProps({ mode: "automatic", permission: "granted" })),
        );

        expect(result.current.showMicPrompt).toBe(false);
    });

    it("returns micDenied true when permission is denied", () => {
        const { result } = renderHook(() =>
            useAutomaticMode(createProps({ mode: "automatic", permission: "denied" })),
        );

        expect(result.current.micDenied).toBe(true);
    });

    it("returns micDenied true when permission is unsupported", () => {
        const { result } = renderHook(() =>
            useAutomaticMode(createProps({ mode: "automatic", permission: "unsupported" })),
        );

        expect(result.current.micDenied).toBe(true);
    });

    it("returns micDenied false when permission is granted", () => {
        const { result } = renderHook(() =>
            useAutomaticMode(createProps({ mode: "automatic", permission: "granted" })),
        );

        expect(result.current.micDenied).toBe(false);
    });

    it("returns detectedPitch when in automatic mode with permission", () => {
        const pitch = { note: "La", midi: 69, frequency: 440, clarity: 0.95 };
        const { result } = renderHook(() =>
            useAutomaticMode(createProps({ mode: "automatic", permission: "granted", detectedPitch: pitch })),
        );

        expect(result.current.detectedPitch).toEqual(pitch);
    });

    it("returns detectedPitch null in manual mode", () => {
        const pitch = { note: "La", midi: 69, frequency: 440, clarity: 0.95 };
        const { result } = renderHook(() =>
            useAutomaticMode(createProps({ mode: "manual", detectedPitch: pitch })),
        );

        expect(result.current.detectedPitch).toBeNull();
    });

    it("does not call onAnswer in manual mode", () => {
        const onAnswer = jest.fn();
        const pitch = { note: "La", midi: 69, frequency: 440, clarity: 0.95 };

        renderHook(() =>
            useAutomaticMode(createProps({ mode: "manual", detectedPitch: pitch, onAnswer })),
        );

        expect(onAnswer).not.toHaveBeenCalled();
    });

    it("does not call onAnswer when already answered", () => {
        const onAnswer = jest.fn();
        const pitch = { note: "La", midi: 69, frequency: 440, clarity: 0.95 };

        renderHook(() =>
            useAutomaticMode(createProps({ mode: "automatic", detectedPitch: pitch, answered: "correct", onAnswer })),
        );

        expect(onAnswer).not.toHaveBeenCalled();
    });

    it("calls onAnswer and onConsumeNote when pitch is detected in automatic mode", () => {
        const onAnswer = jest.fn();
        const onConsumeNote = jest.fn();
        const pitch = { note: "La", midi: 69, frequency: 440, clarity: 0.95 };

        renderHook(() =>
            useAutomaticMode(createProps({ mode: "automatic", detectedPitch: pitch, onAnswer, onConsumeNote })),
        );

        expect(onAnswer).toHaveBeenCalledWith("La", 69);
        expect(onConsumeNote).toHaveBeenCalled();
    });
});
