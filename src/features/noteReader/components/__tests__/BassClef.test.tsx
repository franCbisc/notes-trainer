import React from "react";
import { render } from "@testing-library/react";
import { BassClef } from "../BassClef";
import { STAFF_PADDING, COLORS } from "../../constants";

const CY = 236;

describe("BassClef", () => {
    it("renders a text element with the bass clef character", () => {
        const { container } = render(
            <svg>
                <BassClef cy={CY} />
            </svg>
        );

        const text = container.querySelector("text");
        expect(text).toBeInTheDocument();
        expect(text?.textContent).toBe("𝄢");
    });

    it("positions the text vertically at cy", () => {
        const { container } = render(
            <svg>
                <BassClef cy={CY} />
            </svg>
        );

        const text = container.querySelector("text");
        expect(Number(text?.getAttribute("y"))).toBe(CY);
    });

    it("uses the correct x position", () => {
        const { container } = render(
            <svg>
                <BassClef cy={CY} />
            </svg>
        );

        const text = container.querySelector("text");
        expect(Number(text?.getAttribute("x"))).toBe(STAFF_PADDING + 15);
    });

    it("uses the correct fill color", () => {
        const { container } = render(
            <svg>
                <BassClef cy={CY} />
            </svg>
        );

        const text = container.querySelector("text");
        expect(text?.getAttribute("fill")).toBe(COLORS.text.dark);
    });
});

