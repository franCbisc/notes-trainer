import { act, renderHook } from "@testing-library/react";
import { useQuizLifecycle } from "../useQuizLifecycle";
import type { Note } from "../../types";

describe("useQuizLifecycle", () => {
    const createNote = (overrides: Partial<Note> = {}): Note => ({
        step: 0,
        name: "Do",
        clef: "treble",
        midi: 60,
        ...overrides,
    });

    it("advances note when current is null", () => {
        const advance = jest.fn();
        const generateRandomNote = jest.fn().mockReturnValue(createNote());

        renderHook(() =>
            useQuizLifecycle({
                current: null,
                answered: null,
                advance,
                generateRandomNote,
                clefFilter: "both",
                selectedKey: "Do",
                mode: "manual",
            })
        );

        expect(advance).toHaveBeenCalled();
    });

    it("does not advance when current already exists", () => {
        const advance = jest.fn();
        const generateRandomNote = jest.fn();

        renderHook(() =>
            useQuizLifecycle({
                current: createNote(),
                answered: null,
                advance,
                generateRandomNote,
                clefFilter: "both",
                selectedKey: "Do",
                mode: "manual",
            })
        );

        advance.mockClear();
        expect(advance).not.toHaveBeenCalled();
    });

    it("advances after correct answer with delay", () => {
        jest.useFakeTimers();
        const advance = jest.fn();
        const generateRandomNote = jest.fn().mockReturnValue(createNote());

        const { result, rerender } = renderHook(
            ({ answered }: { answered: "correct" | "wrong" | null }) =>
                useQuizLifecycle({
                    current: createNote(),
                    answered,
                    advance,
                    generateRandomNote,
                    clefFilter: "both",
                    selectedKey: "Do",
                    mode: "manual",
                }),
            { initialProps: { answered: null as "correct" | "wrong" | null } }
        );

        rerender({ answered: "correct" });
        advance.mockClear();

        expect(advance).not.toHaveBeenCalled();

        act(() => {
            jest.advanceTimersByTime(300);
        });

        expect(advance).toHaveBeenCalled();

        jest.useRealTimers();
    });

    it("does not advance after wrong answer", () => {
        jest.useFakeTimers();
        const advance = jest.fn();
        const generateRandomNote = jest.fn();

        const { rerender } = renderHook(
            ({ answered }: { answered: "correct" | "wrong" | null }) =>
                useQuizLifecycle({
                    current: createNote(),
                    answered,
                    advance,
                    generateRandomNote,
                    clefFilter: "both",
                    selectedKey: "Do",
                    mode: "manual",
                }),
            { initialProps: { answered: null as "correct" | "wrong" | null } }
        );

        rerender({ answered: "wrong" });
        advance.mockClear();

        act(() => {
            jest.advanceTimersByTime(300);
        });

        expect(advance).not.toHaveBeenCalled();

        jest.useRealTimers();
    });

    it("advances after correct answer when current is null", () => {
        jest.useFakeTimers();
        const advance = jest.fn();
        const generateRandomNote = jest.fn().mockReturnValue(createNote());

        type Props = { answered: "correct" | "wrong" | null; current: Note | null };
        const { rerender } = renderHook(
            ({ answered, current }: Props) =>
                useQuizLifecycle({
                    current,
                    answered,
                    advance,
                    generateRandomNote,
                    clefFilter: "both",
                    selectedKey: "Do",
                    mode: "manual",
                }),
            { initialProps: { answered: null, current: null } as Props }
        );

        rerender({ answered: "correct", current: null });
        advance.mockClear();

        act(() => {
            jest.advanceTimersByTime(300);
        });

        expect(advance).toHaveBeenCalled();

        jest.useRealTimers();
    });
});
