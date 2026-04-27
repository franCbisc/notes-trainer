/** Larger buffer = better low-note accuracy (~186ms window @ 44.1kHz). */
export const BUFFER_SIZE = 8192;

/** Consecutive frames required before emitting a note. */
export const STABLE_FRAMES = 4;

/** Silence frames required before re-arming after consumeNote(). */
export const SILENCE_FRAMES_TO_REARM = 6;

/** Rolling window for octave-error correction. */
export const OCTAVE_HISTORY_SIZE = 6;

/** Reference frequency for A4 in Hz. */
export const A4_FREQUENCY = 440;

/** MIDI note number for A4. */
export const A4_MIDI_NUMBER = 69;

/** Number of semitones in an octave. */
export const SEMITONES_PER_OCTAVE = 12;

/** Minimum valid MIDI note number. */
export const MIDI_MIN = 0;

/** Maximum valid MIDI note number. */
export const MIDI_MAX = 127;
