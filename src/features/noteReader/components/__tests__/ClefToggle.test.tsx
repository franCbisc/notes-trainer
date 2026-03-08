import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ClefToggle } from "../ClefToggle";

describe("ClefToggle", () => {
    it("renders all three option buttons", () => {
        render(<ClefToggle clefFilter="both" onChange={jest.fn()} />);

        expect(screen.getByRole("button", { name: "Both clefs" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /treble/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /bass/i })).toBeInTheDocument();
    });

    it('marks "Both clefs" as active when clefFilter is "both"', () => {
        render(<ClefToggle clefFilter="both" onChange={jest.fn()} />);

        expect(screen.getByRole("button", { name: "Both clefs" })).toHaveClass("clefBtnActive");
        expect(screen.getByRole("button", { name: /treble/i })).not.toHaveClass("clefBtnActive");
        expect(screen.getByRole("button", { name: /bass/i })).not.toHaveClass("clefBtnActive");
    });

    it('marks "Treble" as active when clefFilter is "treble"', () => {
        render(<ClefToggle clefFilter="treble" onChange={jest.fn()} />);

        expect(screen.getByRole("button", { name: /treble/i })).toHaveClass("clefBtnActive");
        expect(screen.getByRole("button", { name: "Both clefs" })).not.toHaveClass("clefBtnActive");
        expect(screen.getByRole("button", { name: /bass/i })).not.toHaveClass("clefBtnActive");
    });

    it('marks "Bass" as active when clefFilter is "bass"', () => {
        render(<ClefToggle clefFilter="bass" onChange={jest.fn()} />);

        expect(screen.getByRole("button", { name: /bass/i })).toHaveClass("clefBtnActive");
        expect(screen.getByRole("button", { name: "Both clefs" })).not.toHaveClass("clefBtnActive");
        expect(screen.getByRole("button", { name: /treble/i })).not.toHaveClass("clefBtnActive");
    });

    it('calls onChange with "both" when "Both clefs" is clicked', () => {
        const onChange = jest.fn();
        render(<ClefToggle clefFilter="treble" onChange={onChange} />);

        fireEvent.click(screen.getByRole("button", { name: "Both clefs" }));
        expect(onChange).toHaveBeenCalledWith("both");
    });

    it('calls onChange with "treble" when "Treble" is clicked', () => {
        const onChange = jest.fn();
        render(<ClefToggle clefFilter="both" onChange={onChange} />);

        fireEvent.click(screen.getByRole("button", { name: /treble/i }));
        expect(onChange).toHaveBeenCalledWith("treble");
    });

    it('calls onChange with "bass" when "Bass" is clicked', () => {
        const onChange = jest.fn();
        render(<ClefToggle clefFilter="both" onChange={onChange} />);

        fireEvent.click(screen.getByRole("button", { name: /bass/i }));
        expect(onChange).toHaveBeenCalledWith("bass");
    });

    it("calls onChange exactly once per click", () => {
        const onChange = jest.fn();
        render(<ClefToggle clefFilter="both" onChange={onChange} />);

        fireEvent.click(screen.getByRole("button", { name: /treble/i }));
        expect(onChange).toHaveBeenCalledTimes(1);
    });
});
