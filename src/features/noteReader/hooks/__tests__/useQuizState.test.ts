import { act, renderHook } from "@testing-library/react";
import { useQuizState } from "../useQuizState";

describe("useQuizState", () => {
    it("updates state correctly when advancing and answering correctly", () => {
        const onNoteChange = jest.fn();
        const { result } = renderHook(() => useQuizState(onNoteChange));

        act(() => {
            result.current.advance({ step: 0, name: "Do", clef: "treble" });
        });

        let isCorrect = false;
        act(() => {
            isCorrect = result.current.handleAnswer("Do");
        });

        expect(isCorrect).toBe(true);
        expect(result.current.score.total).toBe(1);
        expect(result.current.score.correct).toBe(1);
        expect(result.current.answered).toBe("correct");
    });

    it("records a wrong answer correctly", () => {
        const onNoteChange = jest.fn();
        const { result } = renderHook(() => useQuizState(onNoteChange));

        act(() => {
            result.current.advance({ step: 0, name: "Do", clef: "treble" });
        });

        let isCorrect = true;
        act(() => {
            isCorrect = result.current.handleAnswer("Re");
        });

        expect(isCorrect).toBe(false);
        expect(result.current.score.total).toBe(1);
        expect(result.current.score.correct).toBe(0);
        expect(result.current.answered).toBe("wrong");
        expect(result.current.selected).toBe("Re");
    });

    it("returns false and does not update score when already answered", () => {
        const onNoteChange = jest.fn();
        const { result } = renderHook(() => useQuizState(onNoteChange));

        act(() => {
            result.current.advance({ step: 0, name: "Do", clef: "treble" });
        });
        act(() => {
            result.current.handleAnswer("Do"); // first answer
        });

        let secondResult = true;
        act(() => {
            secondResult = result.current.handleAnswer("Re"); // should be ignored
        });

        expect(secondResult).toBe(false);
        expect(result.current.score.total).toBe(1); // not incremented again
    });

    it("returns false when current is null (no note set yet)", () => {
        const onNoteChange = jest.fn();
        const { result } = renderHook(() => useQuizState(onNoteChange));

        // current is null by default — handleAnswer should bail out
        let returned = true;
        act(() => {
            returned = result.current.handleAnswer("Do");
        });

        expect(returned).toBe(false);
        expect(result.current.score.total).toBe(0);
    });

    it("resetQuiz calls onNoteChange with the initial note", () => {
        const onNoteChange = jest.fn();
        const { result } = renderHook(() => useQuizState(onNoteChange));

        act(() => {
            result.current.resetQuiz();
        });

        expect(onNoteChange).toHaveBeenCalledWith({ step: 0, name: "Do", clef: "treble" });
    });

    it("resetQuiz resets the score", () => {
        const onNoteChange = jest.fn();
        const { result } = renderHook(() => useQuizState(onNoteChange));

        act(() => {
            result.current.advance({ step: 0, name: "Do", clef: "treble" });
        });
        act(() => {
            result.current.handleAnswer("Do");
        });
        act(() => {
            result.current.resetQuiz();
        });

        expect(result.current.score.correct).toBe(0);
        expect(result.current.score.total).toBe(0);
    });

    it("percentage is null when no answers have been given", () => {
        const onNoteChange = jest.fn();
        const { result } = renderHook(() => useQuizState(onNoteChange));

        expect(result.current.percentage).toBeNull();
    });

    it("percentage reflects the correct ratio", () => {
        const onNoteChange = jest.fn();
        const { result } = renderHook(() => useQuizState(onNoteChange));

        act(() => {
            result.current.advance({ step: 0, name: "Do", clef: "treble" });
        });
        act(() => {
            result.current.handleAnswer("Do"); // correct
        });
        act(() => {
            result.current.advance({ step: 1, name: "Re", clef: "treble" });
        });
        act(() => {
            result.current.handleAnswer("Mi"); // wrong
        });

        expect(result.current.percentage).toBe(50);
    });

    it("advance resets answered and selected", () => {
        const onNoteChange = jest.fn();
        const { result } = renderHook(() => useQuizState(onNoteChange));

        act(() => {
            result.current.advance({ step: 0, name: "Do", clef: "treble" });
        });
        act(() => {
            result.current.handleAnswer("Re");
        });
        act(() => {
            result.current.advance({ step: 1, name: "Re", clef: "treble" });
        });

        expect(result.current.answered).toBeNull();
        expect(result.current.selected).toBeNull();
    });

    // ── Automatic mode — wrong-flash behaviour ────────────────────────────────

    describe("automatic mode — wrong-flash reset", () => {
        beforeEach(() => jest.useFakeTimers());
        afterEach(() => jest.useRealTimers());

        it("in automatic mode a wrong answer resets answered to null after 1000 ms", () => {
            const onNoteChange = jest.fn();
            const { result } = renderHook(() => useQuizState(onNoteChange));

            act(() => result.current.setMode("automatic"));
            act(() => result.current.advance({ step: 0, name: "Do", clef: "treble" }));
            act(() => result.current.handleAnswer("Re")); // wrong

            expect(result.current.answered).toBe("wrong");

            act(() => jest.advanceTimersByTime(1000));

            expect(result.current.answered).toBeNull();
            expect(result.current.selected).toBeNull();
        });

        it("in automatic mode a wrong answer does not reset before 1000 ms", () => {
            const onNoteChange = jest.fn();
            const { result } = renderHook(() => useQuizState(onNoteChange));

            act(() => result.current.setMode("automatic"));
            act(() => result.current.advance({ step: 0, name: "Do", clef: "treble" }));
            act(() => result.current.handleAnswer("Re")); // wrong

            act(() => jest.advanceTimersByTime(999));

            expect(result.current.answered).toBe("wrong");
        });

        it("in manual mode a wrong answer does NOT auto-reset", () => {
            const onNoteChange = jest.fn();
            const { result } = renderHook(() => useQuizState(onNoteChange));

            // mode defaults to "manual"
            act(() => result.current.advance({ step: 0, name: "Do", clef: "treble" }));
            act(() => result.current.handleAnswer("Re")); // wrong

            act(() => jest.advanceTimersByTime(2000));

            expect(result.current.answered).toBe("wrong");
        });

        it("calling advance cancels a pending wrong-flash timer", () => {
            const onNoteChange = jest.fn();
            const { result } = renderHook(() => useQuizState(onNoteChange));

            act(() => result.current.setMode("automatic"));
            act(() => result.current.advance({ step: 0, name: "Do", clef: "treble" }));
            act(() => result.current.handleAnswer("Re")); // wrong — timer starts

            // Advance before timer fires
            act(() => {
                jest.advanceTimersByTime(500);
                result.current.advance({ step: 1, name: "Mi", clef: "treble" });
            });

            // The timer should now be cancelled — state remains what advance set
            act(() => jest.advanceTimersByTime(1000));

            expect(result.current.answered).toBeNull();
            expect(result.current.current?.name).toBe("Mi");
        });

        it("calling resetQuiz cancels a pending wrong-flash timer", () => {
            const onNoteChange = jest.fn();
            const { result } = renderHook(() => useQuizState(onNoteChange));

            act(() => result.current.setMode("automatic"));
            act(() => result.current.advance({ step: 0, name: "Do", clef: "treble" }));
            act(() => result.current.handleAnswer("Re")); // wrong — timer starts

            act(() => result.current.resetQuiz());

            // Timer should be gone — score was reset
            act(() => jest.advanceTimersByTime(2000));

            expect(result.current.score.total).toBe(0);
        });

        it("in automatic mode a correct answer does not trigger the flash timer", () => {
            const onNoteChange = jest.fn();
            const { result } = renderHook(() => useQuizState(onNoteChange));

            act(() => result.current.setMode("automatic"));
            act(() => result.current.advance({ step: 0, name: "Do", clef: "treble" }));
            act(() => result.current.handleAnswer("Do")); // correct

            expect(result.current.answered).toBe("correct");

            // answered stays "correct" — no auto-reset
            act(() => jest.advanceTimersByTime(2000));

            expect(result.current.answered).toBe("correct");
        });
    });
});


describe("useQuizState", () => {
    it("updates state correctly when advancing and answering correctly", () => {
        const onNoteChange = jest.fn();
        const { result } = renderHook(() => useQuizState(onNoteChange));

        act(() => {
            result.current.advance({ step: 0, name: "Do", clef: "treble" });
        });

        let isCorrect = false;
        act(() => {
            isCorrect = result.current.handleAnswer("Do");
        });

        expect(isCorrect).toBe(true);
        expect(result.current.score.total).toBe(1);
        expect(result.current.score.correct).toBe(1);
        expect(result.current.answered).toBe("correct");
    });

    it("records a wrong answer correctly", () => {
        const onNoteChange = jest.fn();
        const { result } = renderHook(() => useQuizState(onNoteChange));

        act(() => {
            result.current.advance({ step: 0, name: "Do", clef: "treble" });
        });

        let isCorrect = true;
        act(() => {
            isCorrect = result.current.handleAnswer("Re");
        });

        expect(isCorrect).toBe(false);
        expect(result.current.score.total).toBe(1);
        expect(result.current.score.correct).toBe(0);
        expect(result.current.answered).toBe("wrong");
        expect(result.current.selected).toBe("Re");
    });

    it("returns false and does not update score when already answered", () => {
        const onNoteChange = jest.fn();
        const { result } = renderHook(() => useQuizState(onNoteChange));

        act(() => {
            result.current.advance({ step: 0, name: "Do", clef: "treble" });
        });
        act(() => {
            result.current.handleAnswer("Do"); // first answer
        });

        let secondResult = true;
        act(() => {
            secondResult = result.current.handleAnswer("Re"); // should be ignored
        });

        expect(secondResult).toBe(false);
        expect(result.current.score.total).toBe(1); // not incremented again
    });

    it("returns false when current is null (no note set yet)", () => {
        const onNoteChange = jest.fn();
        const { result } = renderHook(() => useQuizState(onNoteChange));

        // current is null by default — handleAnswer should bail out
        let returned = true;
        act(() => {
            returned = result.current.handleAnswer("Do");
        });

        expect(returned).toBe(false);
        expect(result.current.score.total).toBe(0);
    });

    it("resetQuiz calls onNoteChange with the initial note", () => {
        const onNoteChange = jest.fn();
        const { result } = renderHook(() => useQuizState(onNoteChange));

        act(() => {
            result.current.resetQuiz();
        });

        expect(onNoteChange).toHaveBeenCalledWith({ step: 0, name: "Do", clef: "treble" });
    });

    it("resetQuiz resets the score", () => {
        const onNoteChange = jest.fn();
        const { result } = renderHook(() => useQuizState(onNoteChange));

        act(() => {
            result.current.advance({ step: 0, name: "Do", clef: "treble" });
        });
        act(() => {
            result.current.handleAnswer("Do");
        });
        act(() => {
            result.current.resetQuiz();
        });

        expect(result.current.score.correct).toBe(0);
        expect(result.current.score.total).toBe(0);
    });

    it("percentage is null when no answers have been given", () => {
        const onNoteChange = jest.fn();
        const { result } = renderHook(() => useQuizState(onNoteChange));

        expect(result.current.percentage).toBeNull();
    });

    it("percentage reflects the correct ratio", () => {
        const onNoteChange = jest.fn();
        const { result } = renderHook(() => useQuizState(onNoteChange));

        act(() => {
            result.current.advance({ step: 0, name: "Do", clef: "treble" });
        });
        act(() => {
            result.current.handleAnswer("Do"); // correct
        });
        act(() => {
            result.current.advance({ step: 1, name: "Re", clef: "treble" });
        });
        act(() => {
            result.current.handleAnswer("Mi"); // wrong
        });

        expect(result.current.percentage).toBe(50);
    });

    it("advance resets answered and selected", () => {
        const onNoteChange = jest.fn();
        const { result } = renderHook(() => useQuizState(onNoteChange));

        act(() => {
            result.current.advance({ step: 0, name: "Do", clef: "treble" });
        });
        act(() => {
            result.current.handleAnswer("Re");
        });
        act(() => {
            result.current.advance({ step: 1, name: "Re", clef: "treble" });
        });

        expect(result.current.answered).toBeNull();
        expect(result.current.selected).toBeNull();
    });
});

