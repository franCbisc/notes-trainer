/**
 * Musical note definitions for the Note Reader feature
 */

export const NOTE_NAMES = ["Do", "Re", "Mi", "Fa", "Sol", "La", "Si"] as const;

// ─── Treble Clef Notes ─────────────────────────────────────────────────────
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
