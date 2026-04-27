/**
 * Key signature definitions for the Note Reader feature
 */

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
    "Fa# - Re#m": [
        { baseName: "Fa", accidental: "#", trebleStep: 4, bassStep: 2 },
        { baseName: "Do", accidental: "#", trebleStep: 1, bassStep: -1 },
        { baseName: "Sol", accidental: "#", trebleStep: 5, bassStep: 3 },
        { baseName: "Re", accidental: "#", trebleStep: 2, bassStep: 0 },
        { baseName: "La", accidental: "#", trebleStep: -1, bassStep: 4 },
        { baseName: "Mi", accidental: "#", trebleStep: 3, bassStep: 1 },
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
