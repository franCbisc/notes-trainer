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
    { step: -8, name: "La", midi: 57 },  // La3  – second ledger below
    { step: -7, name: "Si", midi: 59 },  // Si3
    { step: -6, name: "Do", midi: 60 },  // Do4  – first ledger below

    { step: -5, name: "Re", midi: 62 },  // Re4
    { step: -4, name: "Mi", midi: 64 },  // Mi4  – 1st staff line
    { step: -3, name: "Fa", midi: 65 },  // Fa4
    { step: -2, name: "Sol", midi: 67 }, // Sol4 – 2nd staff line
    { step: -1, name: "La", midi: 69 },  // La4
    { step: 0, name: "Si", midi: 71 },   // Si4  – 3rd staff line (center)
    { step: 1, name: "Do", midi: 72 },   // Do5
    { step: 2, name: "Re", midi: 74 },   // Re5  – 4th staff line
    { step: 3, name: "Mi", midi: 76 },   // Mi5
    { step: 4, name: "Fa", midi: 77 },   // Fa5  – 5th staff line
    { step: 5, name: "Sol", midi: 79 },  // Sol5

    { step: 6, name: "La", midi: 81 },   // La5  – first ledger above
    { step: 7, name: "Si", midi: 83 },   // Si5
    { step: 8, name: "Do", midi: 84 },   // Do6  – second ledger above
] as const;

// ─── Bass Clef Notes ──────────────────────────────────────────────────────────
export const BASS_NOTES = [
    { step: -8, name: "Do", midi: 36 },  // Do2  – second ledger below
    { step: -7, name: "Re", midi: 38 },  // Re2
    { step: -6, name: "Mi", midi: 40 },  // Mi2  – first ledger below

    { step: -5, name: "Fa", midi: 41 },  // Fa2
    { step: -4, name: "Sol", midi: 43 }, // Sol2 – 1st staff line
    { step: -3, name: "La", midi: 45 },  // La2
    { step: -2, name: "Si", midi: 47 },  // Si2  – 2nd staff line
    { step: -1, name: "Do", midi: 48 },  // Do3
    { step: 0, name: "Re", midi: 50 },   // Re3  – 3rd staff line (center)
    { step: 1, name: "Mi", midi: 52 },   // Mi3
    { step: 2, name: "Fa", midi: 53 },   // Fa3  – 4th staff line
    { step: 3, name: "Sol", midi: 55 },  // Sol3
    { step: 4, name: "La", midi: 57 },   // La3  – 5th staff line
    { step: 5, name: "Si", midi: 59 },   // Si3

    { step: 6, name: "Do", midi: 60 },   // Do4  – first ledger above
    { step: 7, name: "Re", midi: 62 },   // Re4
    { step: 8, name: "Mi", midi: 64 },   // Mi4  – second ledger above
] as const;

// ─── Key Signatures ───────────────────────────────────────────────────────────
// trebleStep / bassStep use the same half-spacing grid as TREBLE_NOTES / BASS_NOTES.
//
// Treble sharp positions (step): Fa=4, Do=1, Sol=5, Re=2, La=-1, Mi=3, Si=0
// Bass   sharp positions (step): Fa=2, Do=-1, Sol=3, Re=0, La=4, Mi=1, Si=-2
//
// Treble flat  positions (step): Si=0, Mi=3, La=-1, Re=2, Sol=-2, Do=1, Fa=4
// Bass   flat  positions (step): Si=-2, Mi=1, La=-3, Re=0, Sol=3, Do=-1, Fa=2

export const KEY_SIGNATURES: Record<string, Array<{ baseName: string; accidental: "#" | "b"; trebleStep: number; bassStep: number }>> = {
    "Do - Lam":   [],
    // ── Sharp keys ──────────────────────────────────────────────────────────
    "Sol - Mim": [
        { baseName: "Fa", accidental: "#", trebleStep: 4, bassStep: 2 },
    ],
    "Re - Sim": [
        { baseName: "Fa", accidental: "#", trebleStep: 4, bassStep: 2 },
        { baseName: "Do", accidental: "#", trebleStep: 1, bassStep: -1 },
    ],
    "La - Fa#m": [
        { baseName: "Fa", accidental: "#", trebleStep: 4, bassStep: 2 },
        { baseName: "Do", accidental: "#", trebleStep: 1, bassStep: -1 },
        { baseName: "Sol", accidental: "#", trebleStep: 5, bassStep: 3 },
    ],
    "Mi - Do#m": [
        { baseName: "Fa", accidental: "#", trebleStep: 4, bassStep: 2 },
        { baseName: "Do", accidental: "#", trebleStep: 1, bassStep: -1 },
        { baseName: "Sol", accidental: "#", trebleStep: 5, bassStep: 3 },
        { baseName: "Re", accidental: "#", trebleStep: 2, bassStep: 0 },
    ],
    "Si - Sol#m": [
        { baseName: "Fa", accidental: "#", trebleStep: 4, bassStep: 2 },
        { baseName: "Do", accidental: "#", trebleStep: 1, bassStep: -1 },
        { baseName: "Sol", accidental: "#", trebleStep: 5, bassStep: 3 },
        { baseName: "Re", accidental: "#", trebleStep: 2, bassStep: 0 },
        { baseName: "La", accidental: "#", trebleStep: -1, bassStep: 4 },
    ],
    // ── Flat keys ────────────────────────────────────────────────────────────
    "Fa - Rem": [
        { baseName: "Si", accidental: "b", trebleStep: 0, bassStep: -2 },
    ],
    "Sib - Solm": [
        { baseName: "Si", accidental: "b", trebleStep: 0, bassStep: -2 },
        { baseName: "Mi", accidental: "b", trebleStep: 3, bassStep: 1 },
    ],
    "Mib - Dom": [
        { baseName: "Si", accidental: "b", trebleStep: 0, bassStep: -2 },
        { baseName: "Mi", accidental: "b", trebleStep: 3, bassStep: 1 },
        { baseName: "La", accidental: "b", trebleStep: -1, bassStep: -3 },
    ],
    "Lab - Fam": [
        { baseName: "Si", accidental: "b", trebleStep: 0, bassStep: -2 },
        { baseName: "Mi", accidental: "b", trebleStep: 3, bassStep: 1 },
        { baseName: "La", accidental: "b", trebleStep: -1, bassStep: -3 },
        { baseName: "Re", accidental: "b", trebleStep: 2, bassStep: 0 },
    ],
    "Reb - Sibm": [
        { baseName: "Si", accidental: "b", trebleStep: 0,  bassStep: -2 },
        { baseName: "Mi", accidental: "b", trebleStep: 3,  bassStep: 1  },
        { baseName: "La", accidental: "b", trebleStep: -1, bassStep: -3 },
        { baseName: "Re", accidental: "b", trebleStep: 2,  bassStep: 0  },
        { baseName: "Sol", accidental: "b", trebleStep: -2, bassStep: 3 },
    ],
    "Solb - Mibm": [
        { baseName: "Si", accidental: "b", trebleStep: 0,  bassStep: -2 },
        { baseName: "Mi", accidental: "b", trebleStep: 3,  bassStep: 1  },
        { baseName: "La", accidental: "b", trebleStep: -1, bassStep: -3 },
        { baseName: "Re", accidental: "b", trebleStep: 2,  bassStep: 0  },
        { baseName: "Sol", accidental: "b", trebleStep: -2, bassStep: 3 },
        { baseName: "Do", accidental: "b", trebleStep: 1,  bassStep: -1 },
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

