/**
 * SVG and music notation constants for the Note Reader feature
 */

// ─── SVG Dimensions ───────────────────────────────────────────────────────────
export const SVG_WIDTH = 380;
export const LINE_SPACING = 14;
export const HALF_SPACING = LINE_SPACING / 2;
// increase height to account for larger gap between staves; this value may be
// adjusted further if assets (clefs, ledger lines) grow in size.
export const STAFF_HEIGHT = 340;
export const LEFT_PADDING = 30;

// ─── Note Head Dimensions ─────────────────────────────────────────────────────
// bumped up by 1px per design request
export const NOTE_HEAD_RX = 8;
export const NOTE_HEAD_RY = 6.2;
export const NOTE_X = 200;

// ─── Staff Positions ─────────────────────────────────────────────────────────
// Treble staff: center (terza linea = Si4) a y=90
// Bass staff:   center (terza linea = Fa3) a y=TREBLE_CY + STAFF_GAP
export const TREBLE_CY = 110;

// Number of half-spacings between the two staff centers. 12 was originally
// chosen which left only one "imaginary" line between them (C/Do sitting on
// the shared space).  To visually separate the clefs we now use 18 half-
// spacings which corresponds to three full imaginary lines between the staves.
// Changing this constant only affects layout; the note-step logic continues to
// work exactly the same because each staff still computes positions relative
// to its own center `cy`.
const STAFF_GAP = 18 * HALF_SPACING;
export const BASS_CY = TREBLE_CY + STAFF_GAP;

// ─── Musical Notes ───────────────────────────────────────────────────────────
export const NOTE_NAMES = ["Do", "Re", "Mi", "Fa", "Sol", "La", "Si"] as const;

// ─── Treble Clef Notes ───────────────────────────────────────────────────────
// step = diatonic position from the central line of the staff
// Lines: -4, -2, 0, +2, +4
// Spaces: -3, -1, +1, +3
export const TREBLE_NOTES = [
    // three ledger lines below: steps -10, -8, -6
    { step: -10, name: "Fa" },  // third ledger below
    { step: -9, name: "Sol" },
    { step: -8, name: "La" },  // second ledger below
    { step: -7, name: "Si" },
    { step: -6, name: "Do" },  // first ledger below

    { step: -5, name: "Re" },
    { step: -4, name: "Mi" },   // 1st staff line
    { step: -3, name: "Fa" },
    { step: -2, name: "Sol" },  // 2nd staff line
    { step: -1, name: "La" },
    { step: 0, name: "Si" },    // 3rd staff line (center)
    { step: 1, name: "Do" },
    { step: 2, name: "Re" },    // 4th staff line
    { step: 3, name: "Mi" },
    { step: 4, name: "Fa" },    // 5th staff line
    { step: 5, name: "Sol" },

    { step: 6, name: "La" },    // first ledger above
    { step: 7, name: "Si" },
    { step: 8, name: "Do" },    // second ledger above
    { step: 9, name: "Re" },
    { step: 10, name: "Mi" },   // third ledger above
] as const;

// ─── Bass Clef Notes ──────────────────────────────────────────────────────────
export const BASS_NOTES = [
    // three ledger lines below
    { step: -10, name: "La" },  // third ledger below
    { step: -9, name: "Si" },
    { step: -8, name: "Do" },  // second ledger below
    { step: -7, name: "Re" },
    { step: -6, name: "Mi" },  // first ledger below

    { step: -5, name: "Fa" },
    { step: -4, name: "Sol" },  // 1st staff line
    { step: -3, name: "La" },
    { step: -2, name: "Si" },   // 2nd staff line
    { step: -1, name: "Do" },
    { step: 0, name: "Re" },    // 3rd staff line (center)
    { step: 1, name: "Mi" },
    { step: 2, name: "Fa" },    // 4th staff line
    { step: 3, name: "Sol" },
    { step: 4, name: "La" },    // 5th staff line
    { step: 5, name: "Si" },

    { step: 6, name: "Do" },    // first ledger above
    { step: 7, name: "Re" },
    { step: 8, name: "Mi" },    // second ledger above
    { step: 9, name: "Fa" },
    { step: 10, name: "Sol" },  // third ledger above
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

