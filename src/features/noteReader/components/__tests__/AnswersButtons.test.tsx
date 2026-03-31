import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { AnswersButtons } from "../quiz/AnswersButtons";

const NOTE_NAMES = ["Do", "Re", "Mi", "Fa", "Sol", "La", "Si"] as const;

describe("AnswersButtons", () => {
    it("renders a button for each note name", () => {
        render(
            <AnswersButtons
                noteNames={NOTE_NAMES}
                selected={null}
                answered={null}
                onAnswer={jest.fn()}
            />
        );

        NOTE_NAMES.forEach((name) => {
            expect(screen.getByRole("button", { name })).toBeInTheDocument();
        });
    });

    it("calls onAnswer with the correct note name when a button is clicked", () => {
        const onAnswer = jest.fn();
        render(
            <AnswersButtons
                noteNames={NOTE_NAMES}
                selected={null}
                answered={null}
                onAnswer={onAnswer}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: "Re" }));
        expect(onAnswer).toHaveBeenCalledWith("Re");
    });

    it("disables all buttons when answered is 'correct'", () => {
        render(
            <AnswersButtons
                noteNames={NOTE_NAMES}
                selected="Si"
                answered="correct"
                onAnswer={jest.fn()}
            />
        );

        NOTE_NAMES.forEach((name) => {
            expect(screen.getByRole("button", { name })).toBeDisabled();
        });
    });

    it("keeps buttons enabled when answered is 'wrong' (user can guess again)", () => {
        render(
            <AnswersButtons
                noteNames={NOTE_NAMES}
                selected="Re"
                answered="wrong"
                onAnswer={jest.fn()}
            />
        );

        NOTE_NAMES.forEach((name) => {
            expect(screen.getByRole("button", { name })).not.toBeDisabled();
        });
    });

    it("applies btnCorrect class to the selected note when the answer is correct", () => {
        render(
            <AnswersButtons
                noteNames={NOTE_NAMES}
                selected="Si"
                answered="correct"
                onAnswer={jest.fn()}
            />
        );

        expect(screen.getByRole("button", { name: "Si" })).toHaveClass("btnCorrect");
    });

    it("applies btnWrong class to the wrongly selected note", () => {
        render(
            <AnswersButtons
                noteNames={NOTE_NAMES}
                selected="Re"
                answered="wrong"
                onAnswer={jest.fn()}
            />
        );

        expect(screen.getByRole("button", { name: "Re" })).toHaveClass("btnWrong");
    });

    it("does not apply any state class to unselected buttons when answered", () => {
        render(
            <AnswersButtons
                noteNames={NOTE_NAMES}
                selected="Re"
                answered="wrong"
                onAnswer={jest.fn()}
            />
        );

        const others = ["Do", "Mi", "Fa", "Sol", "La", "Si"];
        others.forEach((name) => {
            const btn = screen.getByRole("button", { name });
            expect(btn).not.toHaveClass("btnCorrect");
            expect(btn).not.toHaveClass("btnWrong");
            expect(btn).not.toHaveClass("btnDim");
        });
    });

    it("does not apply any state class when not yet answered", () => {
        render(
            <AnswersButtons
                noteNames={NOTE_NAMES}
                selected={null}
                answered={null}
                onAnswer={jest.fn()}
            />
        );

        NOTE_NAMES.forEach((name) => {
            const btn = screen.getByRole("button", { name });
            expect(btn).toHaveClass("btn");
            expect(btn).not.toHaveClass("btnCorrect");
            expect(btn).not.toHaveClass("btnWrong");
            expect(btn).not.toHaveClass("btnDim");
        });
    });
});
