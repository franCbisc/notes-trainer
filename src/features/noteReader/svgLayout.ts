/**
 * SVG and UI layout constants for the Note Reader feature
 */

// ─── SVG Dimensions ───────────────────────────────────────────────────────────
export const SVG_WIDTH = 370;
export const LINE_SPACING = 14;
export const HALF_SPACING = LINE_SPACING / 2;
export const STAFF_HEIGHT = 360;
export const STAFF_PADDING = 20;

// ─── Note Head Dimensions ─────────────────────────────────────────────────────
export const NOTE_HEAD_RX = 8;
export const NOTE_HEAD_RY = 6.2;
export const NOTE_X = 200;

// ─── Staff Positions ─────────────────────────────────────────────────────────
export const TREBLE_CY = 110;

// To visually separate the clefs we now use 18 half-spacings which corresponds
// to three full imaginary lines between the staves. Changing this constant only
// affects layout; the note-step logic continues to work exactly the same because
// each staff still computes positions relative to its own center `cy`.
const STAFF_GAP = 18 * HALF_SPACING;
export const BASS_CY = TREBLE_CY + STAFF_GAP;

export const COLORS = {
    stroke: {
        staff: "#888",
        brace: "#888",
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
