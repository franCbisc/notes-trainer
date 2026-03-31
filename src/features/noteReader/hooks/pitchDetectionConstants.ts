/** Larger buffer = better low-note accuracy (~186ms window @ 44.1kHz). */
export const BUFFER_SIZE = 8192;

/** Consecutive frames required before emitting a note. */
export const STABLE_FRAMES = 4;

/** Silence frames required before re-arming after consumeNote(). */
export const SILENCE_FRAMES_TO_REARM = 6;

/** Rolling window for octave-error correction. */
export const OCTAVE_HISTORY_SIZE = 6;
