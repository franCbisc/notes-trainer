import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CircleOfFifths } from "../CircleOfFifths";

describe("CircleOfFifths", () => {
    const defaultProps = {
        selectedKey: "Do - Lam",
        onKeySelect: jest.fn(),
    };

    beforeEach(() => jest.clearAllMocks());

    it("renders center circle button with KEY label initially", () => {
        render(<CircleOfFifths {...defaultProps} />);

        const center = document.querySelector(".circleCenter");
        expect(center).toBeInTheDocument();

        const label = document.querySelector(".circleCenterLabel");
        expect(label).toHaveTextContent("KEY");
    });

    it("renders slices when expanded", () => {
        const { container } = render(<CircleOfFifths {...defaultProps} />);
        
        // Initially collapsed - no slices
        let slices = container.querySelectorAll(".circleSlice");
        expect(slices).toHaveLength(0);

        // Click to expand
        const center = container.querySelector(".circleCenter");
        fireEvent.click(center!);
        
        slices = container.querySelectorAll(".circleSlice");
        expect(slices).toHaveLength(12);
    });

    it("calls onKeySelect when a slice is clicked after expanding and closes", () => {
        const onKeySelect = jest.fn();
        const { container } = render(<CircleOfFifths {...defaultProps} onKeySelect={onKeySelect} />);

        // Expand
        const center = container.querySelector(".circleCenter");
        fireEvent.click(center!);

        // Click slice
        const slices = container.querySelectorAll(".circleSlice");
        fireEvent.click(slices[1]);

        expect(onKeySelect).toHaveBeenCalledWith("Sol - Mim");

        // Should be collapsed after selection
        const collapsedSlices = container.querySelectorAll(".circleSlice");
        expect(collapsedSlices).toHaveLength(0);
    });

    it("closes when clicking outside", () => {
        const { container } = render(<CircleOfFifths {...defaultProps} />);

        // Expand
        const center = container.querySelector(".circleCenter");
        fireEvent.click(center!);

        let slices = container.querySelectorAll(".circleSlice");
        expect(slices).toHaveLength(12);

        // Click outside
        fireEvent.mouseDown(document.body);

        slices = container.querySelectorAll(".circleSlice");
        expect(slices).toHaveLength(0);
    });

    it("applies active class to selected key when expanded", () => {
        const { container } = render(<CircleOfFifths {...defaultProps} selectedKey="Sol - Mim" />);
        
        // Expand
        const center = container.querySelector(".circleCenter");
        fireEvent.click(center!);

        const activeSlices = container.querySelectorAll(".circleSliceActive");
        expect(activeSlices).toHaveLength(1);
    });
});
