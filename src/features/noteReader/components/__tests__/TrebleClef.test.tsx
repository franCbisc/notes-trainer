import React from "react";
import { render } from "@testing-library/react";
import { TrebleClef } from "../TrebleClef";
import { STAFF_PADDING, COLORS } from "../../constants";

const CY = 110;

describe("TrebleClef", () => {
    it("renders a text element with the treble clef character", () => {
        const { container } = render(
            <svg>
                <TrebleClef cy={CY} />
            </svg>
        );

        const text = container.querySelector("text");
        expect(text).toBeInTheDocument();
        expect(text?.textContent).toBe("𝄞");
    });

    it("positions the text vertically based on cy", () => {
        const { container } = render(
            <svg>
                <TrebleClef cy={CY} />
            </svg>
        );

        const text = container.querySelector("text");
        expect(Number(text?.getAttribute("y"))).toBe(CY + 15);
    });

    it("uses the correct x position", () => {
        const { container } = render(
            <svg>
                <TrebleClef cy={CY} />
            </svg>
        );

        const text = container.querySelector("text");
        expect(Number(text?.getAttribute("x"))).toBe(STAFF_PADDING + 20);
    });

    it("uses the correct fill color", () => {
        const { container } = render(
            <svg>
                <TrebleClef cy={CY} />
            </svg>
        );

        const text = container.querySelector("text");
        expect(text?.getAttribute("fill")).toBe(COLORS.text.dark);
    });
});

