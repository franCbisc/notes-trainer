import { act, renderHook } from "@testing-library/react";
import { usePitchDetection } from "../usePitchDetection";

describe("usePitchDetection", () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("initial state: not listening and no detected note", () => {
        const { result } = renderHook(() => usePitchDetection());

        expect(result.current.isListening).toBe(false);
        expect(result.current.detectedNote).toBeNull();
    });

    it("sets isListening to true when startListening is called", () => {
        const { result } = renderHook(() => usePitchDetection());

        act(() => {
            result.current.startListening();
        });

        expect(result.current.isListening).toBe(true);
    });

    it("sets detectedNote after 300ms when listening", () => {
        const { result } = renderHook(() => usePitchDetection());

        act(() => {
            result.current.startListening();
        });

        act(() => {
            jest.advanceTimersByTime(300);
        });

        expect(result.current.isListening).toBe(true);
        expect(result.current.detectedNote).not.toBeNull();
    });

    it("stopListening sets isListening to false and clears detectedNote", () => {
        const { result } = renderHook(() => usePitchDetection());

        act(() => {
            result.current.startListening();
        });
        act(() => {
            jest.advanceTimersByTime(300);
        });

        act(() => {
            result.current.stopListening();
        });

        expect(result.current.isListening).toBe(false);
        expect(result.current.detectedNote).toBeNull();
    });

    it("does not set detectedNote before 300ms have elapsed", () => {
        const { result } = renderHook(() => usePitchDetection());

        act(() => {
            result.current.startListening();
        });
        act(() => {
            jest.advanceTimersByTime(299);
        });

        expect(result.current.detectedNote).toBeNull();
    });

    it("useEffect does not start timer when not listening", () => {
        const { result } = renderHook(() => usePitchDetection());

        // isListening starts as false — timer should never fire
        act(() => {
            jest.advanceTimersByTime(1000);
        });

        expect(result.current.detectedNote).toBeNull();
    });
});
