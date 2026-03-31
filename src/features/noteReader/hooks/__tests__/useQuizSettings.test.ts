import { act, renderHook } from "@testing-library/react";
import { useQuizSettings } from "../useQuizSettings";

describe("useQuizSettings", () => {
    it("returns default state values", () => {
        const { result } = renderHook(() => useQuizSettings());

        expect(result.current.clefFilter).toBe("both");
        expect(result.current.selectedKey).toBe("Do");
        expect(result.current.mode).toBe("automatic");
    });

    it("setClefFilter updates clefFilter", () => {
        const { result } = renderHook(() => useQuizSettings());

        act(() => {
            result.current.setClefFilter("treble");
        });

        expect(result.current.clefFilter).toBe("treble");
    });

    it("setSelectedKey updates selectedKey", () => {
        const { result } = renderHook(() => useQuizSettings());

        act(() => {
            result.current.setSelectedKey("Fa");
        });

        expect(result.current.selectedKey).toBe("Fa");
    });

    it("setMode updates mode", () => {
        const { result } = renderHook(() => useQuizSettings());

        act(() => {
            result.current.setMode("automatic");
        });

        expect(result.current.mode).toBe("automatic");
    });

    it("markFirstNotePlayed sets hasPlayedFirstNote to true", () => {
        const { result } = renderHook(() => useQuizSettings());

        expect(result.current.hasPlayedFirstNote).toBe(false);

        act(() => {
            result.current.markFirstNotePlayed();
        });

        expect(result.current.hasPlayedFirstNote).toBe(true);
    });
});
