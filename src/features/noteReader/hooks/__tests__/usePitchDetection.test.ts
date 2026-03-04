import { act, renderHook } from "@testing-library/react";
import { usePitchDetection } from "../usePitchDetection";

it("sets detectedNote after listening", () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => usePitchDetection());

    act(() => {
        result.current.startListening();
    });

    act(() => {
        jest.advanceTimersByTime(300);
    });

    expect(result.current.isListening).toBe(true);
    expect(result.current.detectedNote).not.toBeNull();

    jest.useRealTimers();
});
