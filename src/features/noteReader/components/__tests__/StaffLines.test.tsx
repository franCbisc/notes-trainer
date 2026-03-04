import React from "react";
import { render } from "@testing-library/react";
import { StaffLines } from "../StaffLines";
import { HALF_SPACING, STAFF_PADDING, SVG_WIDTH } from "../../constants";

const CY = 110;

describe("StaffLines", () => {
    it("renders exactly 5 lines", () => {
        const { container } = render(
            <svg>
                <StaffLines cy={CY} />
            </svg>
        );

        expect(container.querySelectorAll("line")).toHaveLength(5);
    });

    it("positions lines at the correct y coordinates", () => {
        const { container } = render(
            <svg>
                <StaffLines cy={CY} />
            </svg>
        );

        const lines = container.querySelectorAll("line");
        const expectedSteps = [-4, -2, 0, 2, 4];

        expectedSteps.forEach((step, i) => {
            const expectedY = CY - step * HALF_SPACING;
            expect(Number(lines[i].getAttribute("y1"))).toBe(expectedY);
            expect(Number(lines[i].getAttribute("y2"))).toBe(expectedY);
        });
    });

    it("lines span from STAFF_PADDING to SVG_WIDTH - STAFF_PADDING", () => {
        const { container } = render(
            <svg>
                <StaffLines cy={CY} />
            </svg>
        );

        const lines = container.querySelectorAll("line");
        lines.forEach((line) => {
            expect(Number(line.getAttribute("x1"))).toBe(STAFF_PADDING);
            expect(Number(line.getAttribute("x2"))).toBe(SVG_WIDTH - STAFF_PADDING);
        });
    });
});

