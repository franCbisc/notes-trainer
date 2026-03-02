/**
 * SVG and music notation constants for the Note Reader feature
 */

// ─── SVG Dimensions ───────────────────────────────────────────────────────────
export const SVG_WIDTH = 320;
export const LINE_SPACING = 14;
export const HALF_SPACING = LINE_SPACING / 2;
export const STAFF_HEIGHT = 280;
export const LEFT_PADDING = 20;

// ─── Note Head Dimensions ─────────────────────────────────────────────────────
// bumped up by 1px per design request
export const NOTE_HEAD_RX = 8;
export const NOTE_HEAD_RY = 6.2;
export const NOTE_X = 200;

// ─── Staff Positions ─────────────────────────────────────────────────────────
// Treble staff: center (terza linea = Si4) a y=90
// Bass staff:   center (terza linea = Fa3) a y=TREBLE_CY + 12*HALF_SPACING
export const TREBLE_CY = 90;
export const BASS_CY = TREBLE_CY + 12 * HALF_SPACING;

// ─── Musical Notes ───────────────────────────────────────────────────────────
export const NOTE_NAMES = ["Do", "Re", "Mi", "Fa", "Sol", "La", "Si"] as const;

// ─── Treble Clef Notes ───────────────────────────────────────────────────────
// step = diatonic position from the central line of the staff
// Lines: -4, -2, 0, +2, +4
// Spaces: -3, -1, +1, +3
export const TREBLE_NOTES = [
    { step: -6, name: "Do" },   // supplementary line below
    { step: -5, name: "Re" },
    { step: -4, name: "Mi" },   // 1st line
    { step: -3, name: "Fa" },
    { step: -2, name: "Sol" },  // 2nd line
    { step: -1, name: "La" },
    { step: 0, name: "Si" },    // 3rd line (center)
    { step: 1, name: "Do" },
    { step: 2, name: "Re" },    // 4th line
    { step: 3, name: "Mi" },
    { step: 4, name: "Fa" },    // 5th line
    { step: 5, name: "Sol" },
    { step: 6, name: "La" },    // supplementary line above
] as const;

// ─── Bass Clef Notes ──────────────────────────────────────────────────────────
export const BASS_NOTES = [
    { step: -6, name: "Mi" },   // supplementary line below
    { step: -5, name: "Fa" },
    { step: -4, name: "Sol" },  // 1st line
    { step: -3, name: "La" },
    { step: -2, name: "Si" },   // 2nd line
    { step: -1, name: "Do" },
    { step: 0, name: "Re" },    // 3rd line (center)
    { step: 1, name: "Mi" },
    { step: 2, name: "Fa" },    // 4th line
    { step: 3, name: "Sol" },
    { step: 4, name: "La" },    // 5th line
    { step: 5, name: "Si" },
    { step: 6, name: "Do" },    // supplementary line above
] as const;

// ─── Colors ──────────────────────────────────────────────────────────────────
export const COLORS = {
    stroke: {
        staff: "#666",
        brace: "#333",
        stem: "#111",
    },
    noteHead: {
        default: "#111",
        correct: "#16a34a",
        wrong: "#dc2626",
    },
    text: {
        dark: "#333",
    },
} as const;

