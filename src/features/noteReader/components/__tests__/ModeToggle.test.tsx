import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModeToggle } from "../ModeToggle";

describe("ModeToggle", () => {
    it("renders Manual and Automatic buttons", () => {
        render(<ModeToggle mode="manual" onChange={jest.fn()} />);

        expect(screen.getByRole("button", { name: "Manual" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /automatic/i })).toBeInTheDocument();
    });

    it("marks the Manual button as active when mode is manual", () => {
        render(<ModeToggle mode="manual" onChange={jest.fn()} />);

        expect(screen.getByRole("button", { name: "Manual" })).toHaveClass("modeBtnActive");
        expect(screen.getByRole("button", { name: /automatic/i })).not.toHaveClass("modeBtnActive");
    });

    it("marks the Automatic button as active when mode is automatic", () => {
        render(<ModeToggle mode="automatic" onChange={jest.fn()} />);

        expect(screen.getByRole("button", { name: /automatic/i })).toHaveClass("modeBtnActive");
        expect(screen.getByRole("button", { name: "Manual" })).not.toHaveClass("modeBtnActive");
    });

    it("calls onChange with 'manual' when Manual button is clicked", () => {
        const onChange = jest.fn();
        render(<ModeToggle mode="automatic" onChange={onChange} />);

        fireEvent.click(screen.getByRole("button", { name: "Manual" }));
        expect(onChange).toHaveBeenCalledWith("manual");
    });

    it("calls onChange with 'automatic' when Automatic button is clicked", () => {
        const onChange = jest.fn();
        render(<ModeToggle mode="manual" onChange={onChange} />);

        fireEvent.click(screen.getByRole("button", { name: /automatic/i }));
        expect(onChange).toHaveBeenCalledWith("automatic");
    });

    it("disables both buttons when disabled prop is true", () => {
        render(<ModeToggle mode="manual" onChange={jest.fn()} disabled={true} />);

        expect(screen.getByRole("button", { name: "Manual" })).toBeDisabled();
        expect(screen.getByRole("button", { name: /automatic/i })).toBeDisabled();
    });

    it("does not disable buttons by default", () => {
        render(<ModeToggle mode="manual" onChange={jest.fn()} />);

        expect(screen.getByRole("button", { name: "Manual" })).not.toBeDisabled();
        expect(screen.getByRole("button", { name: /automatic/i })).not.toBeDisabled();
    });
});

