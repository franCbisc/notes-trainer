import { act, renderHook } from "@testing-library/react";
import { useQuizState } from "../useQuizState";

describe("useQuizState", () => {
    // ── basic state ────────────────────────────────────────────────────────────

    it("updates state correctly when advancing and answering correctly", () => {
        const onNoteChange = jest.fn();
        const { result } = renderHook(() => useQuizState(onNoteChange));

        act(() => { result.current.advance({ step: 0, name: "Do", clef: "treble" }); });

        let isCorrect = false;
        act(() => { isCorrect = result.current.handleAnswer("Do"); });

        expect(isCorrect).toBe(true);
        expect(result.current.score.total).toBe(1);
        expect(result.current.score.correct).toBe(1);
        expect(result.current.answered).toBe("correct");
    });

    it("records a wrong answer: answered='wrong', score not incremented", () => {
        const onNoteChange = jest.fn();
        const { result } = renderHook(() => useQuizState(onNoteChange));

        act(() => { result.current.advance({ step: 0, name: "Do", clef: "treble" }); });

        let isCorrect = true;
        act(() => { isCorrect = result.current.handleAnswer("Re"); });

        expect(isCorrect).toBe(false);
        expect(result.current.score.total).toBe(0);   // not counted until correct
        expect(result.current.score.correct).toBe(0);
        expect(result.current.answered).toBe("wrong");
        expect(result.current.selected).toBe("Re");
    });

    it("returns false and does not update score when answered is 'correct'", () => {
        const onNoteChange = jest.fn();
        const { result } = renderHook(() => useQuizState(onNoteChange));

        act(() => { result.current.advance({ step: 0, name: "Do", clef: "treble" }); });
        act(() => { result.current.handleAnswer("Do"); }); // correct → locked

        let secondResult = true;
        act(() => { secondResult = result.current.handleAnswer("Re"); });

        expect(secondResult).toBe(false);
        expect(result.current.score.total).toBe(1);
    });

    it("returns false when current is null (no note set yet)", () => {
        const onNoteChange = jest.fn();
        const { result } = renderHook(() => useQuizState(onNoteChange));

        let returned = true;
        act(() => { returned = result.current.handleAnswer("Do"); });

        expect(returned).toBe(false);
        expect(result.current.score.total).toBe(0);
    });

    it("resetQuiz calls onNoteChange with the initial note", () => {
        const onNoteChange = jest.fn();
        const { result } = renderHook(() => useQuizState(onNoteChange));

        act(() => { result.current.resetQuiz(); });

        expect(onNoteChange).toHaveBeenCalledWith({ step: -6, name: "Do", clef: "treble", midi: 60 });
    });

    it("resetQuiz resets the score", () => {
        const onNoteChange = jest.fn();
        const { result } = renderHook(() => useQuizState(onNoteChange));

        act(() => { result.current.advance({ step: 0, name: "Do", clef: "treble" }); });
        act(() => { result.current.handleAnswer("Do"); });
        act(() => { result.current.resetQuiz(); });

        expect(result.current.score.correct).toBe(0);
        expect(result.current.score.total).toBe(0);
    });

    it("percentage is null when no answers have been given", () => {
        const onNoteChange = jest.fn();
        const { result } = renderHook(() => useQuizState(onNoteChange));

        expect(result.current.percentage).toBeNull();
    });

    it("percentage reflects the correct ratio (only correct answers counted)", () => {
        const onNoteChange = jest.fn();
        const { result } = renderHook(() => useQuizState(onNoteChange));

        jest.useFakeTimers();

        // note 1 — answer correctly
        act(() => { result.current.advance({ step: 0, name: "Do", clef: "treble" }); });
        act(() => { result.current.handleAnswer("Do"); }); // correct → total=1, correct=1

        // note 2 — answer correctly
        act(() => { result.current.advance({ step: 1, name: "Re", clef: "treble" }); });
        act(() => { result.current.handleAnswer("Re"); }); // correct → total=2, correct=2

        // note 3 — answer wrong (should not count)
        act(() => { result.current.advance({ step: 2, name: "Mi", clef: "treble" }); });
        act(() => { result.current.handleAnswer("Do"); }); // wrong — not counted
        act(() => { jest.advanceTimersByTime(1000); });    // flash resets

        jest.useRealTimers();

        // 2 correct out of 2 total = 100%
        expect(result.current.score.total).toBe(2);
        expect(result.current.score.correct).toBe(2);
        expect(result.current.percentage).toBe(100);
    });

    it("advance resets answered and selected", () => {
        const onNoteChange = jest.fn();
        const { result } = renderHook(() => useQuizState(onNoteChange));

        jest.useFakeTimers();
        act(() => { result.current.advance({ step: 0, name: "Do", clef: "treble" }); });
        act(() => { result.current.handleAnswer("Re"); }); // wrong
        act(() => { jest.advanceTimersByTime(1000); });   // flash resets
        act(() => { result.current.advance({ step: 1, name: "Re", clef: "treble" }); });
        jest.useRealTimers();

        expect(result.current.answered).toBeNull();
        expect(result.current.selected).toBeNull();
    });

    // ── wrong-flash reset (both modes) ─────────────────────────────────────────

    describe("wrong-flash reset", () => {
        beforeEach(() => jest.useFakeTimers());
        afterEach(() => jest.useRealTimers());

        it("a wrong answer resets answered to null after 1000 ms (manual mode)", () => {
            const onNoteChange = jest.fn();
            const { result } = renderHook(() => useQuizState(onNoteChange));

            act(() => { result.current.advance({ step: 0, name: "Do", clef: "treble" }); });
            act(() => { result.current.handleAnswer("Re"); }); // wrong

            expect(result.current.answered).toBe("wrong");

            act(() => { jest.advanceTimersByTime(1000); });

            expect(result.current.answered).toBeNull();
            expect(result.current.selected).toBeNull();
        });

        it("a wrong answer resets answered to null after 1000 ms (automatic mode)", () => {
            const onNoteChange = jest.fn();
            const { result } = renderHook(() => useQuizState(onNoteChange));

            act(() => { result.current.advance({ step: 0, name: "Do", clef: "treble" }); });
            act(() => { result.current.handleAnswer("Re"); }); // wrong

            expect(result.current.answered).toBe("wrong");

            act(() => { jest.advanceTimersByTime(1000); });

            expect(result.current.answered).toBeNull();
            expect(result.current.selected).toBeNull();
        });

        it("a wrong answer does not reset before 1000 ms", () => {
            const onNoteChange = jest.fn();
            const { result } = renderHook(() => useQuizState(onNoteChange));

            act(() => { result.current.advance({ step: 0, name: "Do", clef: "treble" }); });
            act(() => { result.current.handleAnswer("Re"); }); // wrong

            act(() => { jest.advanceTimersByTime(999); });

            expect(result.current.answered).toBe("wrong");
        });

        it("user can guess again in manual mode after the flash resets", () => {
            const onNoteChange = jest.fn();
            const { result } = renderHook(() => useQuizState(onNoteChange));

            act(() => { result.current.advance({ step: 0, name: "Do", clef: "treble" }); });
            act(() => { result.current.handleAnswer("Re"); }); // wrong
            act(() => { jest.advanceTimersByTime(1000); });    // flash over

            expect(result.current.answered).toBeNull();

            // now guess correctly
            let isCorrect = false;
            act(() => { isCorrect = result.current.handleAnswer("Do"); });

            expect(isCorrect).toBe(true);
            expect(result.current.answered).toBe("correct");
            expect(result.current.score.total).toBe(1);
            expect(result.current.score.correct).toBe(1);
        });

        it("calling advance cancels a pending wrong-flash timer", () => {
            const onNoteChange = jest.fn();
            const { result } = renderHook(() => useQuizState(onNoteChange));

            act(() => { result.current.advance({ step: 0, name: "Do", clef: "treble" }); });
            act(() => { result.current.handleAnswer("Re"); }); // wrong — timer starts

            act(() => {
                jest.advanceTimersByTime(500);
                result.current.advance({ step: 1, name: "Mi", clef: "treble" });
            });

            act(() => { jest.advanceTimersByTime(1000); });

            expect(result.current.answered).toBeNull();
            expect(result.current.current?.name).toBe("Mi");
        });

        it("calling resetQuiz cancels a pending wrong-flash timer", () => {
            const onNoteChange = jest.fn();
            const { result } = renderHook(() => useQuizState(onNoteChange));

            act(() => { result.current.advance({ step: 0, name: "Do", clef: "treble" }); });
            act(() => { result.current.handleAnswer("Re"); }); // wrong — timer starts
            act(() => { result.current.resetQuiz(); });

            act(() => { jest.advanceTimersByTime(2000); });

            expect(result.current.score.total).toBe(0);
        });

        it("a correct answer does not trigger the flash timer", () => {
            const onNoteChange = jest.fn();
            const { result } = renderHook(() => useQuizState(onNoteChange));

            act(() => { result.current.advance({ step: 0, name: "Do", clef: "treble" }); });
            act(() => { result.current.handleAnswer("Do"); }); // correct

            expect(result.current.answered).toBe("correct");

            act(() => { jest.advanceTimersByTime(2000); });

            expect(result.current.answered).toBe("correct"); // stays locked
        });
    });

    // ── enharmonic equivalence ─────────────────────────────────────────────────

    describe("enharmonic equivalence", () => {
        it("accepts La# when the current note is Sib", () => {
            const onNoteChange = jest.fn();
            const { result } = renderHook(() => useQuizState(onNoteChange));

            act(() => { result.current.advance({ step: 0, name: "Sib", clef: "treble" }); });

            let isCorrect = false;
            act(() => { isCorrect = result.current.handleAnswer("La#"); });

            expect(isCorrect).toBe(true);
            expect(result.current.answered).toBe("correct");
        });

        it("accepts Sib when the current note is La#", () => {
            const onNoteChange = jest.fn();
            const { result } = renderHook(() => useQuizState(onNoteChange));

            act(() => { result.current.advance({ step: 0, name: "La#", clef: "treble" }); });

            let isCorrect = false;
            act(() => { isCorrect = result.current.handleAnswer("Sib"); });

            expect(isCorrect).toBe(true);
            expect(result.current.answered).toBe("correct");
        });

        it("accepts Re# when the current note is Mib", () => {
            const onNoteChange = jest.fn();
            const { result } = renderHook(() => useQuizState(onNoteChange));

            act(() => { result.current.advance({ step: 0, name: "Mib", clef: "treble" }); });

            let isCorrect = false;
            act(() => { isCorrect = result.current.handleAnswer("Re#"); });

            expect(isCorrect).toBe(true);
        });

        it("accepts Fa# when the current note is Solb", () => {
            const onNoteChange = jest.fn();
            const { result } = renderHook(() => useQuizState(onNoteChange));

            act(() => { result.current.advance({ step: 0, name: "Solb", clef: "treble" }); });

            let isCorrect = false;
            act(() => { isCorrect = result.current.handleAnswer("Fa#"); });

            expect(isCorrect).toBe(true);
        });

        it("accepts Sol# when the current note is Lab", () => {
            const onNoteChange = jest.fn();
            const { result } = renderHook(() => useQuizState(onNoteChange));

            act(() => { result.current.advance({ step: 0, name: "Lab", clef: "treble" }); });

            let isCorrect = false;
            act(() => { isCorrect = result.current.handleAnswer("Sol#"); });

            expect(isCorrect).toBe(true);
        });

        it("does not accept a completely wrong note even with enharmonics in scope", () => {
            const onNoteChange = jest.fn();
            const { result } = renderHook(() => useQuizState(onNoteChange));

            act(() => { result.current.advance({ step: 0, name: "Sib", clef: "treble", midi: 70 }); });

            let isCorrect = true;
            act(() => { isCorrect = result.current.handleAnswer("Do"); });

            expect(isCorrect).toBe(false);
            expect(result.current.answered).toBe("wrong");
        });
    });

    // ── octave checking ────────────────────────────────────────────────────────

    describe("octave checking", () => {
        beforeEach(() => jest.useFakeTimers());
        afterEach(() => jest.useRealTimers());

        it("accepts the correct note in the correct octave (midi matches exactly)", () => {
            const onNoteChange = jest.fn();
            const { result } = renderHook(() => useQuizState(onNoteChange));

            // Do4 = MIDI 60
            act(() => { result.current.advance({ step: -6, name: "Do", clef: "treble", midi: 60 }); });

            let isCorrect = false;
            act(() => { isCorrect = result.current.handleAnswer("Do", 60); });

            expect(isCorrect).toBe(true);
        });

        it("rejects the correct note name in the wrong octave", () => {
            const onNoteChange = jest.fn();
            const { result } = renderHook(() => useQuizState(onNoteChange));

            // Do4 = MIDI 60; player plays Do5 = MIDI 72 (12 semitones away)
            act(() => { result.current.advance({ step: -6, name: "Do", clef: "treble", midi: 60 }); });

            let isCorrect = true;
            act(() => { isCorrect = result.current.handleAnswer("Do", 72); });

            expect(isCorrect).toBe(false);
            expect(result.current.answered).toBe("wrong");
        });

        it("accepts a note within ±6 semitones of the target midi", () => {
            const onNoteChange = jest.fn();
            const { result } = renderHook(() => useQuizState(onNoteChange));

            // Do4 = MIDI 60; played MIDI 66 = Fa#4, 6 semitones away — still accepted (same octave region)
            act(() => { result.current.advance({ step: -6, name: "Do", clef: "treble", midi: 60 }); });

            let isCorrect = false;
            act(() => { isCorrect = result.current.handleAnswer("Do", 66); });

            expect(isCorrect).toBe(true);
        });

        it("rejects a note 7 semitones above the target midi (different octave region)", () => {
            const onNoteChange = jest.fn();
            const { result } = renderHook(() => useQuizState(onNoteChange));

            act(() => { result.current.advance({ step: -6, name: "Do", clef: "treble", midi: 60 }); });

            let isCorrect = true;
            act(() => { isCorrect = result.current.handleAnswer("Do", 67); });

            expect(isCorrect).toBe(false);
        });

        it("skips octave check when playedMidi is undefined (manual mode)", () => {
            const onNoteChange = jest.fn();
            const { result } = renderHook(() => useQuizState(onNoteChange));

            act(() => { result.current.advance({ step: -6, name: "Do", clef: "treble", midi: 60 }); });

            let isCorrect = false;
            act(() => { isCorrect = result.current.handleAnswer("Do"); }); // no midi

            expect(isCorrect).toBe(true);
        });

        it("octave check also works for enharmonic equivalents", () => {
            const onNoteChange = jest.fn();
            const { result } = renderHook(() => useQuizState(onNoteChange));

            // Sib4 = La#4 = MIDI 70; played La# = MIDI 70 → correct
            act(() => { result.current.advance({ step: 0, name: "Sib", clef: "treble", midi: 70 }); });

            let isCorrect = false;
            act(() => { isCorrect = result.current.handleAnswer("La#", 70); });

            expect(isCorrect).toBe(true);
        });

        it("rejects enharmonic equivalent in wrong octave", () => {
            const onNoteChange = jest.fn();
            const { result } = renderHook(() => useQuizState(onNoteChange));

            // Sib4 = MIDI 70; played La#5 = MIDI 82 → wrong octave
            act(() => { result.current.advance({ step: 0, name: "Sib", clef: "treble", midi: 70 }); });

            let isCorrect = true;
            act(() => { isCorrect = result.current.handleAnswer("La#", 82); });

            expect(isCorrect).toBe(false);
        });
    });
});

