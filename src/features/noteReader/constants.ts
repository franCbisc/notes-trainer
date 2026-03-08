/**
 * SVG and music notation constants for the Note Reader feature
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

// ─── Musical Notes ───────────────────────────────────────────────────────────
export const NOTE_NAMES = ["Do", "Re", "Mi", "Fa", "Sol", "La", "Si"] as const;

// ─── Treble Clef Notes ───────────────────────────────────────────────────────
export const TREBLE_NOTES = [
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
] as const;

// ─── Bass Clef Notes ──────────────────────────────────────────────────────────
export const BASS_NOTES = [
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
] as const;

// ─── Key Signatures ───────────────────────────────────────────────────────────
// Accidentals are listed in the conventional order they appear on the staff.
// trebleStep / bassStep use the same half-spacing grid as TREBLE_NOTES / BASS_NOTES.
//
// Treble sharp positions (step): Fa=4, Do=1, Sol=5, Re=2, La=-1, Mi=3, Si=0
// Bass   sharp positions (step): Fa=2, Do=-1, Sol=3, Re=0, La=4, Mi=1, Si=-2
//
// Treble flat  positions (step): Si=0, Mi=3, La=-1, Re=2, Sol=5, Do=1, Fa=4
// Bass   flat  positions (step): Si=-2, Mi=1, La=-3, Re=0, Sol=3, Do=-1, Fa=2

export const KEY_SIGNATURES: Record<string, Array<{ baseName: string; accidental: "#" | "b"; trebleStep: number; bassStep: number }>> = {
    "Do":   [],
    // ── Sharp keys ──────────────────────────────────────────────────────────
    "Sol": [
        { baseName: "Fa", accidental: "#", trebleStep: 4, bassStep: 2 },
    ],
    "Re": [
        { baseName: "Fa", accidental: "#", trebleStep: 4, bassStep: 2 },
        { baseName: "Do", accidental: "#", trebleStep: 1, bassStep: -1 },
    ],
    "La": [
        { baseName: "Fa", accidental: "#", trebleStep: 4, bassStep: 2 },
        { baseName: "Do", accidental: "#", trebleStep: 1, bassStep: -1 },
        { baseName: "Sol", accidental: "#", trebleStep: 5, bassStep: 3 },
    ],
    "Mi": [
        { baseName: "Fa", accidental: "#", trebleStep: 4, bassStep: 2 },
        { baseName: "Do", accidental: "#", trebleStep: 1, bassStep: -1 },
        { baseName: "Sol", accidental: "#", trebleStep: 5, bassStep: 3 },
        { baseName: "Re", accidental: "#", trebleStep: 2, bassStep: 0 },
    ],
    "Si": [
        { baseName: "Fa", accidental: "#", trebleStep: 4, bassStep: 2 },
        { baseName: "Do", accidental: "#", trebleStep: 1, bassStep: -1 },
        { baseName: "Sol", accidental: "#", trebleStep: 5, bassStep: 3 },
        { baseName: "Re", accidental: "#", trebleStep: 2, bassStep: 0 },
        { baseName: "La", accidental: "#", trebleStep: -1, bassStep: 4 },
    ],
    "Fa#": [
        { baseName: "Fa", accidental: "#", trebleStep: 4, bassStep: 2 },
        { baseName: "Do", accidental: "#", trebleStep: 1, bassStep: -1 },
        { baseName: "Sol", accidental: "#", trebleStep: 5, bassStep: 3 },
        { baseName: "Re", accidental: "#", trebleStep: 2, bassStep: 0 },
        { baseName: "La", accidental: "#", trebleStep: -1, bassStep: 4 },
        { baseName: "Mi", accidental: "#", trebleStep: 3, bassStep: 1 },
    ],
    "Do#": [
        { baseName: "Fa", accidental: "#", trebleStep: 4, bassStep: 2 },
        { baseName: "Do", accidental: "#", trebleStep: 1, bassStep: -1 },
        { baseName: "Sol", accidental: "#", trebleStep: 5, bassStep: 3 },
        { baseName: "Re", accidental: "#", trebleStep: 2, bassStep: 0 },
        { baseName: "La", accidental: "#", trebleStep: -1, bassStep: 4 },
        { baseName: "Mi", accidental: "#", trebleStep: 3, bassStep: 1 },
        { baseName: "Si", accidental: "#", trebleStep: 0, bassStep: -2 },
    ],
    // ── Flat keys ────────────────────────────────────────────────────────────
    "Fa": [
        { baseName: "Si", accidental: "b", trebleStep: 0, bassStep: -2 },
    ],
    "Sib": [
        { baseName: "Si", accidental: "b", trebleStep: 0, bassStep: -2 },
        { baseName: "Mi", accidental: "b", trebleStep: 3, bassStep: 1 },
    ],
    "Mib": [
        { baseName: "Si", accidental: "b", trebleStep: 0, bassStep: -2 },
        { baseName: "Mi", accidental: "b", trebleStep: 3, bassStep: 1 },
        { baseName: "La", accidental: "b", trebleStep: -1, bassStep: -3 },
    ],
    "Lab": [
        { baseName: "Si", accidental: "b", trebleStep: 0, bassStep: -2 },
        { baseName: "Mi", accidental: "b", trebleStep: 3, bassStep: 1 },
        { baseName: "La", accidental: "b", trebleStep: -1, bassStep: -3 },
        { baseName: "Re", accidental: "b", trebleStep: 2, bassStep: 0 },
    ],
    "Reb": [
        { baseName: "Si", accidental: "b", trebleStep: 0, bassStep: -2 },
        { baseName: "Mi", accidental: "b", trebleStep: 3, bassStep: 1 },
        { baseName: "La", accidental: "b", trebleStep: -1, bassStep: -3 },
        { baseName: "Re", accidental: "b", trebleStep: 2, bassStep: 0 },
        { baseName: "Sol", accidental: "b", trebleStep: 5, bassStep: 3 },
    ],
    "Solb": [
        { baseName: "Si", accidental: "b", trebleStep: 0, bassStep: -2 },
        { baseName: "Mi", accidental: "b", trebleStep: 3, bassStep: 1 },
        { baseName: "La", accidental: "b", trebleStep: -1, bassStep: -3 },
        { baseName: "Re", accidental: "b", trebleStep: 2, bassStep: 0 },
        { baseName: "Sol", accidental: "b", trebleStep: 5, bassStep: 3 },
        { baseName: "Do", accidental: "b", trebleStep: 1, bassStep: -1 },
    ],
    "Dob": [
        { baseName: "Si", accidental: "b", trebleStep: 0, bassStep: -2 },
        { baseName: "Mi", accidental: "b", trebleStep: 3, bassStep: 1 },
        { baseName: "La", accidental: "b", trebleStep: -1, bassStep: -3 },
        { baseName: "Re", accidental: "b", trebleStep: 2, bassStep: 0 },
        { baseName: "Sol", accidental: "b", trebleStep: 5, bassStep: 3 },
        { baseName: "Do", accidental: "b", trebleStep: 1, bassStep: -1 },
        { baseName: "Fa", accidental: "b", trebleStep: 4, bassStep: 2 },
    ],
};

/** Ordered list of key names for the selector UI */
export const KEY_SIGNATURE_NAMES = Object.keys(KEY_SIGNATURES) as (keyof typeof KEY_SIGNATURES)[];

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

