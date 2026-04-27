/**
 * Utility functions for pitch detection and note mapping.
 *
 * The mapping uses the standard equal-tempered scale (A4 = 440 Hz).
 * Each semitone is rounded to the nearest half-step so that, e.g., a C# and a
 * Db map to the same note class but their Italian names differ.
 *
 * The NOTE_NAMES exported from constants only contain natural notes (Do Re Mi …).
 * Pitch detection must match those names so the quiz answer-checking works.
 * Sharps and flats are therefore represented as their enharmonic Italian names:
 *   C# / Db → Do#
 *   D# / Eb → Re#
 *   F# / Gb → Fa#
 *   G# / Ab → Sol#
 *   A# / Bb → La#
 */

import {
    A4_FREQUENCY,
    A4_MIDI_NUMBER,
    SEMITONES_PER_OCTAVE,
    MIDI_MIN,
    MIDI_MAX,
} from "../hooks/pitchDetectionConstants";

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
    "Do",
    "Do#",
    "Re",
    "Re#",
    "Mi",
    "Fa",
    "Fa#",
    "Sol",
    "Sol#",
    "La",
    "La#",
    "Si",
];

/**
 * Converts a frequency in Hz to the closest MIDI note number.
 * Returns -1 when the frequency is ≤ 0.
 *
 * Formula: midi = A4_MIDI_NUMBER + SEMITONES_PER_OCTAVE * log2(f / A4_FREQUENCY)
 */
export function frequencyToMidi(frequencyHz: number): number {
    if (frequencyHz <= 0) return -1;
    return Math.round(A4_MIDI_NUMBER + SEMITONES_PER_OCTAVE * Math.log2(frequencyHz / A4_FREQUENCY));
}

/**
 * Maps a MIDI note number to an Italian note name (e.g. "Do", "Fa#", "Si").
 * Returns `null` when the MIDI value is out of range (< MIDI_MIN or > MIDI_MAX).
 */
export function midiToNoteName(midi: number): string | null {
    if (midi < MIDI_MIN || midi > MIDI_MAX) return null;
    const semitone = midi % SEMITONES_PER_OCTAVE;
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

/**
 * Converts a frequency in Hz to both an Italian note name and its exact MIDI number.
 * Returns `null` when the frequency is invalid.
 */
export function frequencyToNoteWithMidi(frequencyHz: number): { name: string; midi: number } | null {
    const midi = frequencyToMidi(frequencyHz);
    const name = midiToNoteName(midi);
    if (name === null) return null;
    return { name, midi };
}

/**
 * Converts a MIDI number to an Italian note name with octave (e.g. "La4", "Do#3").
 */
export function midiToNoteNameWithOctave(midi: number): string | null {
    const name = midiToNoteName(midi);
    if (name === null) return null;
    const octave = Math.floor(midi / SEMITONES_PER_OCTAVE) - 1;
    return `${name}${octave}`;
}

