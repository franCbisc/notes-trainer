/**
 * Pure utility functions for pitch detection and note mapping.
 *
 * Frequency → MIDI → note name (Italian notation, with sharps and flats).
 *
 * The mapping uses the standard equal-tempered scale (A4 = 440 Hz).
 * Each semitone is rounded to the nearest half-step so that, e.g., a C# and a
 * Db map to the same note class but their Italian names differ.
 *
 * The NOTE_NAMES exported from constants only contain natural notes (Do Re Mi …).
 * Pitch detection must match those names so the quiz answer-checking works.
 * Sharps and flats are therefore represented as their enharmonic Italian names:
 *   C# / Db → Do#
 *   D# / Eb → Re#   (enharmonically Mib, but we prefer the sharp spelling)
 *   F# / Gb → Fa#
 *   G# / Ab → Sol#
 *   A# / Bb → La#
 *
 * Because the quiz currently only tests natural notes (Do, Re, Mi, Fa, Sol, La, Si),
 * non-natural notes will never match a quiz answer, but the detection is still
 * useful for feedback and future expansion.
 */

/** Minimum clarity (0–1) from pitchy for a pitch to be considered valid. */
export const MIN_CLARITY = 0.9;

/** Minimum RMS volume (linear, 0–1) below which silence is assumed. */
export const MIN_VOLUME_DB = -30;

/**
 * Piano frequency range (standard 88-key piano).
 * A0 ≈ 27.5 Hz (lowest key) — C8 ≈ 4186 Hz (highest key).
 * Any detected pitch outside this range is discarded as non-piano noise.
 */
export const PIANO_FREQ_MIN = 27.5;
export const PIANO_FREQ_MAX = 4186.0;

/**
 * Returns true when the frequency falls within the range of a standard piano.
 */
export function isPianoFrequency(frequencyHz: number): boolean {
    return frequencyHz >= PIANO_FREQ_MIN && frequencyHz <= PIANO_FREQ_MAX;
}

/**
 * Italian note names indexed by semitone class (0 = C, 1 = C#, …, 11 = B).
 * Accidentals use the sharp spelling so they are consistent across octaves.
 */
const SEMITONE_TO_ITALIAN: readonly string[] = [
    "Do",   // 0  C
    "Do#",  // 1  C# / Db
    "Re",   // 2  D
    "Re#",  // 3  D# / Eb
    "Mi",   // 4  E
    "Fa",   // 5  F
    "Fa#",  // 6  F# / Gb
    "Sol",  // 7  G
    "Sol#", // 8  G# / Ab
    "La",   // 9  A
    "La#",  // 10 A# / Bb
    "Si",   // 11 B
];

/**
 * Converts a frequency in Hz to the closest MIDI note number.
 * Returns -1 when the frequency is ≤ 0.
 *
 * Formula: midi = 69 + 12 * log2(f / 440)
 */
export function frequencyToMidi(frequencyHz: number): number {
    if (frequencyHz <= 0) return -1;
    return Math.round(69 + 12 * Math.log2(frequencyHz / 440));
}

/**
 * Maps a MIDI note number to an Italian note name (e.g. "Do", "Fa#", "Si").
 * Returns `null` when the MIDI value is out of range (< 0 or > 127).
 */
export function midiToNoteName(midi: number): string | null {
    if (midi < 0 || midi > 127) return null;
    const semitone = midi % 12;
    return SEMITONE_TO_ITALIAN[semitone];
}

/**
 * Converts a frequency in Hz directly to an Italian note name.
 * Returns `null` when the frequency is invalid.
 */
export function frequencyToNoteName(frequencyHz: number): string | null {
    const midi = frequencyToMidi(frequencyHz);
    return midiToNoteName(midi);
}

