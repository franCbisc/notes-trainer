import React from "react";
import { render } from "@testing-library/react";
import { KeySignatureAccidentals } from "../notation/KeySignatureAccidentals";
import { KeyAccidental } from "../../types";

const sharpFa: KeyAccidental = { baseName: "Fa", accidental: "#", trebleStep: 4, bassStep: 2 };
const flatSi: KeyAccidental = { baseName: "Si", accidental: "b", trebleStep: 0, bassStep: -2 };

describe("KeySignatureAccidentals", () => {
    it("renders nothing when accidentals array is empty", () => {
        const { container } = render(
            <svg><KeySignatureAccidentals accidentals={[]} /></svg>
        );
        expect(container.querySelectorAll("text")).toHaveLength(0);
    });

    it("renders two text elements per accidental (one per staff)", () => {
        const { container } = render(
            <svg><KeySignatureAccidentals accidentals={[sharpFa]} /></svg>
        );
        // One for treble staff, one for bass staff
        expect(container.querySelectorAll("text")).toHaveLength(2);
    });

    it("renders the ♯ glyph for sharp accidentals", () => {
        const { container } = render(
            <svg><KeySignatureAccidentals accidentals={[sharpFa]} /></svg>
        );
        const texts = Array.from(container.querySelectorAll("text"));
        expect(texts.every((t) => t.textContent === "♯")).toBe(true);
    });

    it("renders the ♭ glyph for flat accidentals", () => {
        const { container } = render(
            <svg><KeySignatureAccidentals accidentals={[flatSi]} /></svg>
        );
        const texts = Array.from(container.querySelectorAll("text"));
        expect(texts.every((t) => t.textContent === "♭")).toBe(true);
    });

    it("renders 2 × n text elements for n accidentals", () => {
        const { container } = render(
            <svg><KeySignatureAccidentals accidentals={[sharpFa, flatSi]} /></svg>
        );
        expect(container.querySelectorAll("text")).toHaveLength(4);
    });

    it("positions accidentals at increasing x offsets", () => {
        const { container } = render(
            <svg><KeySignatureAccidentals accidentals={[sharpFa, flatSi]} /></svg>
        );
        const texts = Array.from(container.querySelectorAll("text"));
        const xs = texts.map((t) => Number(t.getAttribute("x")));
        // First two share the same x (treble + bass for accidental 0),
        // last two share a larger x (treble + bass for accidental 1)
        expect(xs[0]).toBe(xs[1]);
        expect(xs[2]).toBe(xs[3]);
        expect(xs[2]).toBeGreaterThan(xs[0]);
    });
});

