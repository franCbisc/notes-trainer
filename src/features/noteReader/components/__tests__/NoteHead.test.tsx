import React from "react";
import { render } from "@testing-library/react";
import { NoteHead } from "../NoteHead";
import { COLORS, HALF_SPACING } from "../../constants";

const CY = 110;

describe("NoteHead", () => {
    it("renders an ellipse and a stem line", () => {
        const { container } = render(
            <svg>
                <NoteHead step={0} cy={CY} answerStatus={null} />
            </svg>
        );

        expect(container.querySelector("ellipse")).toBeInTheDocument();
        expect(container.querySelectorAll("line").length).toBeGreaterThanOrEqual(1);
    });

    it("uses default color when not answered", () => {
        const { container } = render(
            <svg>
                <NoteHead step={0} cy={CY} answerStatus={null} />
            </svg>
        );

        const ellipse = container.querySelector("ellipse")!;
        expect(ellipse.getAttribute("fill")).toBe(COLORS.noteHead.default);
    });

    it("uses correct color when answered correctly", () => {
        const { container } = render(
            <svg>
                <NoteHead step={0} cy={CY} answerStatus="correct" />
            </svg>
        );

        const ellipse = container.querySelector("ellipse")!;
        expect(ellipse.getAttribute("fill")).toBe(COLORS.noteHead.correct);
    });

    it("uses wrong color when answered incorrectly", () => {
        const { container } = render(
            <svg>
                <NoteHead step={0} cy={CY} answerStatus="wrong" />
            </svg>
        );

        const ellipse = container.querySelector("ellipse")!;
        expect(ellipse.getAttribute("fill")).toBe(COLORS.noteHead.wrong);
    });

    it("renders ledger lines for notes above the staff (step > 4)", () => {
        const { container } = render(
            <svg>
                <NoteHead step={6} cy={CY} answerStatus={null} />
            </svg>
        );

        const lines = container.querySelectorAll("line");
        expect(lines.length).toBeGreaterThanOrEqual(2);
    });

    it("renders ledger lines for notes below the staff (step < -4)", () => {
        const { container } = render(
            <svg>
                <NoteHead step={-6} cy={CY} answerStatus={null} />
            </svg>
        );

        const lines = container.querySelectorAll("line");
        expect(lines.length).toBeGreaterThanOrEqual(2);
    });

    it("does not render ledger lines for notes within the staff", () => {
        const { container } = render(
            <svg>
                <NoteHead step={0} cy={CY} answerStatus={null} />
            </svg>
        );

        expect(container.querySelectorAll("line").length).toBe(1);
    });

    it("positions the ellipse at the correct vertical coordinate", () => {
        const step = 2;
        const { container } = render(
            <svg>
                <NoteHead step={step} cy={CY} answerStatus={null} />
            </svg>
        );

        const ellipse = container.querySelector("ellipse")!;
        const expectedCy = CY - step * HALF_SPACING;
        expect(Number(ellipse.getAttribute("cy"))).toBe(expectedCy);
    });
});
