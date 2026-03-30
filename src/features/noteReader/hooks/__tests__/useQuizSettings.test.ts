import { act, renderHook } from "@testing-library/react";
import { useQuizSettings } from "../useQuizSettings";

describe("useQuizSettings", () => {
    it("returns default state values", () => {
        const { result } = renderHook(() => useQuizSettings());

        expect(result.current.clefFilter).toBe("both");
        expect(result.current.selectedKey).toBe("Do");
        expect(result.current.mode).toBe("manual");
        expect(result.current.settingsOpen).toBe(false);
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

    it("setSettingsOpen updates settingsOpen", () => {
        const { result } = renderHook(() => useQuizSettings());

        act(() => {
            result.current.setSettingsOpen(true);
        });

        expect(result.current.settingsOpen).toBe(true);
    });

    it("setSettingsOpen accepts a function updater", () => {
        const { result } = renderHook(() => useQuizSettings());

        act(() => {
            result.current.setSettingsOpen((prev) => !prev);
        });

        expect(result.current.settingsOpen).toBe(true);
    });

    it("toggleSettings toggles settingsOpen", () => {
        const { result } = renderHook(() => useQuizSettings());

        act(() => {
            result.current.toggleSettings();
        });

        expect(result.current.settingsOpen).toBe(true);

        act(() => {
            result.current.toggleSettings();
        });

        expect(result.current.settingsOpen).toBe(false);
    });

    it("closeSettings sets settingsOpen to false", () => {
        const { result } = renderHook(() => useQuizSettings());

        act(() => {
            result.current.setSettingsOpen(true);
        });

        act(() => {
            result.current.closeSettings();
        });

        expect(result.current.settingsOpen).toBe(false);
    });

    it("handleModeChange updates mode and closes settings", () => {
        const { result } = renderHook(() => useQuizSettings());

        act(() => {
            result.current.handleModeChange("automatic");
        });

        expect(result.current.mode).toBe("automatic");
        expect(result.current.settingsOpen).toBe(false);
    });
});
