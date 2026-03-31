import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Header } from "../quiz/Header";

describe("Header", () => {
    const defaultProps = {
        mode: "manual" as const,
        onModeChange: jest.fn(),
        clefFilter: "both" as const,
        onClefChange: jest.fn(),
        selectedKey: "Do - Lam",
        onKeyChange: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders mode switch with Manual and Auto labels", () => {
        render(<Header {...defaultProps} />);

        expect(screen.getByText("Manual")).toBeInTheDocument();
        expect(screen.getByText("Auto")).toBeInTheDocument();
    });

    it("calls onModeChange with 'automatic' when mode switch is clicked", () => {
        const onModeChange = jest.fn();
        render(<Header {...defaultProps} onModeChange={onModeChange} />);

        fireEvent.click(screen.getByRole("button", { name: /switch to automatic mode/i }));

        expect(onModeChange).toHaveBeenCalledWith("automatic");
    });

    it("calls onModeChange with 'manual' when in automatic mode", () => {
        const onModeChange = jest.fn();
        render(<Header {...defaultProps} mode="automatic" onModeChange={onModeChange} />);

        fireEvent.click(screen.getByRole("button", { name: /switch to manual mode/i }));

        expect(onModeChange).toHaveBeenCalledWith("manual");
    });

    it("renders three clef buttons", () => {
        render(<Header {...defaultProps} />);

        expect(screen.getByText("Both")).toBeInTheDocument();
        expect(screen.getByText("𝄞")).toBeInTheDocument();
        expect(screen.getByText("𝄢")).toBeInTheDocument();
    });

    it("highlights active clef button (treble)", () => {
        render(<Header {...defaultProps} clefFilter="treble" />);

        const trebleBtn = document.querySelector('.clefBtn[aria-pressed="true"]');
        expect(trebleBtn).toHaveClass("clefBtnActive");
    });

    it("highlights active clef button (bass)", () => {
        render(<Header {...defaultProps} clefFilter="bass" />);

        const bassBtn = document.querySelector('.clefBtn[aria-pressed="true"]');
        expect(bassBtn).toHaveClass("clefBtnActive");
    });

    it("calls onClefChange when clef button is clicked (treble)", () => {
        const onClefChange = jest.fn();
        render(<Header {...defaultProps} onClefChange={onClefChange} />);

        fireEvent.click(screen.getByText("𝄞").closest("button")!);

        expect(onClefChange).toHaveBeenCalledWith("treble");
    });

    it("calls onClefChange when clef button is clicked (both)", () => {
        const onClefChange = jest.fn();
        render(<Header {...defaultProps} clefFilter="treble" onClefChange={onClefChange} />);

        fireEvent.click(screen.getByText("Both").closest("button")!);

        expect(onClefChange).toHaveBeenCalledWith("both");
    });

    it("calls onClefChange when clef button is clicked (bass)", () => {
        const onClefChange = jest.fn();
        render(<Header {...defaultProps} clefFilter="treble" onClefChange={onClefChange} />);

        fireEvent.click(screen.getByText("𝄢").closest("button")!);

        expect(onClefChange).toHaveBeenCalledWith("bass");
    });

    it("highlights the active mode label", () => {
        const { rerender } = render(<Header {...defaultProps} mode="manual" />);

        expect(screen.getByText("Manual").getAttribute("class")).toContain("modeLabelActive");

        rerender(<Header {...defaultProps} mode="automatic" />);

        expect(screen.getByText("Auto").getAttribute("class")).toContain("modeLabelActive");
    });
});
