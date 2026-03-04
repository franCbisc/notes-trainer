import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { AnswersButtons } from "../AnswersButtons";
import { Note } from "../../types";

const NOTE_NAMES = ["Do", "Re", "Mi", "Fa", "Sol", "La", "Si"] as const;

const currentNote: Note = { step: 0, name: "Si", clef: "treble" };

describe("AnswersButtons", () => {
    it("renders a button for each note name", () => {
        render(
            <AnswersButtons
                noteNames={NOTE_NAMES}
                current={currentNote}
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
                current={currentNote}
                selected={null}
                answered={null}
                onAnswer={onAnswer}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: "Re" }));
        expect(onAnswer).toHaveBeenCalledWith("Re");
    });

    it("disables all buttons when answered is set", () => {
        render(
            <AnswersButtons
                noteNames={NOTE_NAMES}
                current={currentNote}
                selected="Re"
                answered="wrong"
                onAnswer={jest.fn()}
            />
        );

        NOTE_NAMES.forEach((name) => {
            expect(screen.getByRole("button", { name })).toBeDisabled();
        });
    });

    it("applies btnCorrect class to the correct note when answered", () => {
        render(
            <AnswersButtons
                noteNames={NOTE_NAMES}
                current={currentNote}
                selected="Re"
                answered="wrong"
                onAnswer={jest.fn()}
            />
        );

        expect(screen.getByRole("button", { name: "Si" })).toHaveClass("btnCorrect");
    });

    it("applies btnWrong class to the wrongly selected note", () => {
        render(
            <AnswersButtons
                noteNames={NOTE_NAMES}
                current={currentNote}
                selected="Re"
                answered="wrong"
                onAnswer={jest.fn()}
            />
        );

        expect(screen.getByRole("button", { name: "Re" })).toHaveClass("btnWrong");
    });

    it("applies btnDim class to all other buttons when answered", () => {
        render(
            <AnswersButtons
                noteNames={NOTE_NAMES}
                current={currentNote}
                selected="Re"
                answered="wrong"
                onAnswer={jest.fn()}
            />
        );

        const dimmed = ["Do", "Mi", "Fa", "Sol", "La"];
        dimmed.forEach((name) => {
            expect(screen.getByRole("button", { name })).toHaveClass("btnDim");
        });
    });

    it("does not apply any state class when not yet answered", () => {
        render(
            <AnswersButtons
                noteNames={NOTE_NAMES}
                current={currentNote}
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

