import { act, renderHook } from "@testing-library/react";
import { useQuizState } from "../useQuizState";

it("updates state when advancing and answering", () => {
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
});

it("resetQuiz calls onNoteChange", () => {
    const onNoteChange = jest.fn();
    const { result } = renderHook(() => useQuizState(onNoteChange));

    act(() => {
        result.current.resetQuiz();
    });

    expect(onNoteChange).toHaveBeenCalledWith({ step: 0, name: "Do", clef: "treble" });
});
