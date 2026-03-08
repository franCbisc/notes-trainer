import React from "react";
import { render } from "@testing-library/react";
import { GrandStaff } from "../GrandStaff";
import { Note } from "../../types";
import { SVG_WIDTH, STAFF_HEIGHT } from "../../constants";

const trebleNote: Note = { step: 0, name: "Si", clef: "treble" };
const bassNote: Note = { step: 0, name: "Do", clef: "bass" };

describe("GrandStaff", () => {
    it("renders an SVG element with the correct viewBox", () => {
        const { container } = render(
            <GrandStaff current={trebleNote} answered={false} correct={false} />
        );

        const svg = container.querySelector("svg");
        expect(svg).toBeInTheDocument();
        expect(svg?.getAttribute("viewBox")).toBe(`0 0 ${SVG_WIDTH} ${STAFF_HEIGHT}`);
    });

    it("renders 10 staff lines (5 treble + 5 bass)", () => {
        const { container } = render(
            <GrandStaff current={trebleNote} answered={false} correct={false} />
        );

        // StaffLines renders 5 lines each, two instances = 10
        // Plus the brace vertical line = 11 total lines minimum
        const lines = container.querySelectorAll("line");
        expect(lines.length).toBeGreaterThanOrEqual(10);
    });

    it("renders a note head for a treble clef note", () => {
        const { container } = render(
            <GrandStaff current={trebleNote} answered={false} correct={false} />
        );

        expect(container.querySelector("ellipse")).toBeInTheDocument();
    });

    it("renders a note head for a bass clef note", () => {
        const { container } = render(
            <GrandStaff current={bassNote} answered={false} correct={false} />
        );

        expect(container.querySelector("ellipse")).toBeInTheDocument();
    });

    it("renders both treble and bass clef symbols", () => {
        const { container } = render(
            <GrandStaff current={trebleNote} answered={false} correct={false} />
        );

        const textElements = container.querySelectorAll("text");
        const textContents = Array.from(textElements).map((el) => el.textContent);

        expect(textContents).toContain("𝄞");
        expect(textContents).toContain("𝄢");
    });

    it("passes answered and correct props down to NoteHead", () => {
        const { container: c1 } = render(
            <GrandStaff current={trebleNote} answered={false} correct={false} />
        );
        const { container: c2 } = render(
            <GrandStaff current={trebleNote} answered={true} correct={true} />
        );

        const ellipse1 = c1.querySelector("ellipse")!;
        const ellipse2 = c2.querySelector("ellipse")!;

        expect(ellipse1.getAttribute("fill")).not.toBe(ellipse2.getAttribute("fill"));
    });
});

