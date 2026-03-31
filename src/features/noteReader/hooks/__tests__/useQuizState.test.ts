import { act, renderHook } from "@testing-library/react";
import { useQuizState } from "../useQuizState";

describe("useQuizState", () => {
    it("updates answered to correct when answer is correct", () => {
        const { result } = renderHook(() => useQuizState());

        act(() => { result.current.advance({ step: 0, name: "Do", clef: "treble" }); });

        let isCorrect = false;
        act(() => { isCorrect = result.current.handleAnswer("Do"); });

        expect(isCorrect).toBe(true);
        expect(result.current.answered).toBe("correct");
    });

    it("updates answered to wrong and sets selected when answer is incorrect", () => {
        const { result } = renderHook(() => useQuizState());

        act(() => { result.current.advance({ step: 0, name: "Do", clef: "treble" }); });

        let isCorrect = true;
        act(() => { isCorrect = result.current.handleAnswer("Re"); });

        expect(isCorrect).toBe(false);
        expect(result.current.answered).toBe("wrong");
        expect(result.current.selected).toBe("Re");
    });

    it("returns false when answered is already correct", () => {
        const { result } = renderHook(() => useQuizState());

        act(() => { result.current.advance({ step: 0, name: "Do", clef: "treble" }); });
        act(() => { result.current.handleAnswer("Do"); });

        let secondResult = true;
        act(() => { secondResult = result.current.handleAnswer("Re"); });

        expect(secondResult).toBe(false);
    });

    it("returns false when current is null (no note set yet)", () => {
        const { result } = renderHook(() => useQuizState());

        let returned = true;
        act(() => { returned = result.current.handleAnswer("Do"); });

        expect(returned).toBe(false);
    });

    it("advance resets answered and selected", () => {
        const { result } = renderHook(() => useQuizState());

        jest.useFakeTimers();
        act(() => { result.current.advance({ step: 0, name: "Do", clef: "treble" }); });
        act(() => { result.current.handleAnswer("Re"); });
        act(() => { jest.advanceTimersByTime(1000); });
        act(() => { result.current.advance({ step: 1, name: "Re", clef: "treble" }); });
        jest.useRealTimers();

        expect(result.current.answered).toBeNull();
        expect(result.current.selected).toBeNull();
    });

    describe("wrong-flash reset", () => {
        beforeEach(() => jest.useFakeTimers());
        afterEach(() => jest.useRealTimers());

        it("a wrong answer resets answered to null after 1000 ms", () => {
            const { result } = renderHook(() => useQuizState());

            act(() => { result.current.advance({ step: 0, name: "Do", clef: "treble" }); });
            act(() => { result.current.handleAnswer("Re"); });

            expect(result.current.answered).toBe("wrong");

            act(() => { jest.advanceTimersByTime(1000); });

            expect(result.current.answered).toBeNull();
            expect(result.current.selected).toBeNull();
        });

        it("a wrong answer does not reset before 1000 ms", () => {
            const onNoteChange = jest.fn();
            const { result } = renderHook(() => useQuizState());

            act(() => { result.current.advance({ step: 0, name: "Do", clef: "treble" }); });
            act(() => { result.current.handleAnswer("Re"); });

            act(() => { jest.advanceTimersByTime(999); });

            expect(result.current.answered).toBe("wrong");
        });

        it("user can guess again after the flash resets", () => {
            const onNoteChange = jest.fn();
            const { result } = renderHook(() => useQuizState());

            act(() => { result.current.advance({ step: 0, name: "Do", clef: "treble" }); });
            act(() => { result.current.handleAnswer("Re"); });
            act(() => { jest.advanceTimersByTime(1000); });

            expect(result.current.answered).toBeNull();

            let isCorrect = false;
            act(() => { isCorrect = result.current.handleAnswer("Do"); });

            expect(isCorrect).toBe(true);
            expect(result.current.answered).toBe("correct");
        });

        it("calling advance cancels a pending wrong-flash timer", () => {
            const onNoteChange = jest.fn();
            const { result } = renderHook(() => useQuizState());

            act(() => { result.current.advance({ step: 0, name: "Do", clef: "treble" }); });
            act(() => { result.current.handleAnswer("Re"); });

            act(() => {
                jest.advanceTimersByTime(500);
                result.current.advance({ step: 1, name: "Mi", clef: "treble" });
            });

            act(() => { jest.advanceTimersByTime(1000); });

            expect(result.current.answered).toBeNull();
            expect(result.current.current?.name).toBe("Mi");
        });

        it("a correct answer does not trigger the flash timer", () => {
            const onNoteChange = jest.fn();
            const { result } = renderHook(() => useQuizState());

            act(() => { result.current.advance({ step: 0, name: "Do", clef: "treble" }); });
            act(() => { result.current.handleAnswer("Do"); });

            expect(result.current.answered).toBe("correct");

            act(() => { jest.advanceTimersByTime(2000); });

            expect(result.current.answered).toBe("correct");
        });
    });

    describe("enharmonic equivalence", () => {
        it("accepts La# when the current note is Sib", () => {
            const onNoteChange = jest.fn();
            const { result } = renderHook(() => useQuizState());

            act(() => { result.current.advance({ step: 0, name: "Sib", clef: "treble" }); });

            let isCorrect = false;
            act(() => { isCorrect = result.current.handleAnswer("La#"); });

            expect(isCorrect).toBe(true);
            expect(result.current.answered).toBe("correct");
        });

        it("accepts Sib when the current note is La#", () => {
            const onNoteChange = jest.fn();
            const { result } = renderHook(() => useQuizState());

            act(() => { result.current.advance({ step: 0, name: "La#", clef: "treble" }); });

            let isCorrect = false;
            act(() => { isCorrect = result.current.handleAnswer("Sib"); });

            expect(isCorrect).toBe(true);
            expect(result.current.answered).toBe("correct");
        });

        it("accepts Re# when the current note is Mib", () => {
            const onNoteChange = jest.fn();
            const { result } = renderHook(() => useQuizState());

            act(() => { result.current.advance({ step: 0, name: "Mib", clef: "treble" }); });

            let isCorrect = false;
            act(() => { isCorrect = result.current.handleAnswer("Re#"); });

            expect(isCorrect).toBe(true);
        });

        it("accepts Fa# when the current note is Solb", () => {
            const onNoteChange = jest.fn();
            const { result } = renderHook(() => useQuizState());

            act(() => { result.current.advance({ step: 0, name: "Solb", clef: "treble" }); });

            let isCorrect = false;
            act(() => { isCorrect = result.current.handleAnswer("Fa#"); });

            expect(isCorrect).toBe(true);
        });

        it("accepts Sol# when the current note is Lab", () => {
            const onNoteChange = jest.fn();
            const { result } = renderHook(() => useQuizState());

            act(() => { result.current.advance({ step: 0, name: "Lab", clef: "treble" }); });

            let isCorrect = false;
            act(() => { isCorrect = result.current.handleAnswer("Sol#"); });

            expect(isCorrect).toBe(true);
        });

        it("does not accept a completely wrong note even with enharmonics in scope", () => {
            const onNoteChange = jest.fn();
            const { result } = renderHook(() => useQuizState());

            act(() => { result.current.advance({ step: 0, name: "Sib", clef: "treble", midi: 70 }); });

            let isCorrect = true;
            act(() => { isCorrect = result.current.handleAnswer("Do"); });

            expect(isCorrect).toBe(false);
            expect(result.current.answered).toBe("wrong");
        });
    });

    describe("octave checking", () => {
        beforeEach(() => jest.useFakeTimers());
        afterEach(() => jest.useRealTimers());

        it("accepts the correct note in the correct octave (midi matches exactly)", () => {
            const onNoteChange = jest.fn();
            const { result } = renderHook(() => useQuizState());

            act(() => { result.current.advance({ step: -6, name: "Do", clef: "treble", midi: 60 }); });

            let isCorrect = false;
            act(() => { isCorrect = result.current.handleAnswer("Do", 60); });

            expect(isCorrect).toBe(true);
        });

        it("rejects the correct note name in the wrong octave", () => {
            const onNoteChange = jest.fn();
            const { result } = renderHook(() => useQuizState());

            act(() => { result.current.advance({ step: -6, name: "Do", clef: "treble", midi: 60 }); });

            let isCorrect = true;
            act(() => { isCorrect = result.current.handleAnswer("Do", 72); });

            expect(isCorrect).toBe(false);
            expect(result.current.answered).toBe("wrong");
        });

        it("accepts a note within ±6 semitones of the target midi", () => {
            const onNoteChange = jest.fn();
            const { result } = renderHook(() => useQuizState());

            act(() => { result.current.advance({ step: -6, name: "Do", clef: "treble", midi: 60 }); });

            let isCorrect = false;
            act(() => { isCorrect = result.current.handleAnswer("Do", 66); });

            expect(isCorrect).toBe(true);
        });

        it("rejects a note 7 semitones above the target midi (different octave region)", () => {
            const onNoteChange = jest.fn();
            const { result } = renderHook(() => useQuizState());

            act(() => { result.current.advance({ step: -6, name: "Do", clef: "treble", midi: 60 }); });

            let isCorrect = true;
            act(() => { isCorrect = result.current.handleAnswer("Do", 67); });

            expect(isCorrect).toBe(false);
        });

        it("skips octave check when playedMidi is undefined (manual mode)", () => {
            const onNoteChange = jest.fn();
            const { result } = renderHook(() => useQuizState());

            act(() => { result.current.advance({ step: -6, name: "Do", clef: "treble", midi: 60 }); });

            let isCorrect = false;
            act(() => { isCorrect = result.current.handleAnswer("Do"); });

            expect(isCorrect).toBe(true);
        });

        it("octave check also works for enharmonic equivalents", () => {
            const onNoteChange = jest.fn();
            const { result } = renderHook(() => useQuizState());

            act(() => { result.current.advance({ step: 0, name: "Sib", clef: "treble", midi: 70 }); });

            let isCorrect = false;
            act(() => { isCorrect = result.current.handleAnswer("La#", 70); });

            expect(isCorrect).toBe(true);
        });

        it("rejects enharmonic equivalent in wrong octave", () => {
            const onNoteChange = jest.fn();
            const { result } = renderHook(() => useQuizState());

            act(() => { result.current.advance({ step: 0, name: "Sib", clef: "treble", midi: 70 }); });

            let isCorrect = true;
            act(() => { isCorrect = result.current.handleAnswer("La#", 82); });

            expect(isCorrect).toBe(false);
        });

        it("falls back to note name when midiToNoteNameWithOctave returns null", () => {
            const onNoteChange = jest.fn();
            const { result } = renderHook(() => useQuizState());

            act(() => { result.current.advance({ step: 0, name: "La", clef: "treble", midi: 69 }); });

            act(() => { result.current.handleAnswer("La", -1); });

            expect(result.current.selected).toBe("La");
        });
    });
});

