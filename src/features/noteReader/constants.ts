/**
 * Barrel file re-exporting all constants for the Note Reader feature.
 *
 * For new code, import directly from the focused modules:
 *   - svgLayout.ts (SVG dimensions, staff positions, colors)
 *   - notes.ts (NOTE_NAMES, TREBLE_NOTES, BASS_NOTES)
 *   - keySignatures.ts (KEY_SIGNATURES, KEY_SIGNATURE_NAMES)
 *   - circleOfFifths.ts (Circle of Fifths geometry)
 */

export {
    SVG_WIDTH,
    LINE_SPACING,
    HALF_SPACING,
    STAFF_HEIGHT,
    STAFF_PADDING,
    NOTE_HEAD_RX,
    NOTE_HEAD_RY,
    NOTE_X,
    TREBLE_CY,
    BASS_CY,
    COLORS,
} from "./svgLayout";

export {
    NOTE_NAMES,
    TREBLE_NOTES,
    BASS_NOTES,
} from "./notes";

export {
    KEY_SIGNATURES,
    KEY_SIGNATURE_NAMES,
} from "./keySignatures";

export {
    CIRCLE_SLICES,
    CIRCLE_RADIUS_OUTER,
    CIRCLE_RADIUS_INNER_COLLAPSED,
    CIRCLE_RADIUS_INNER_EXPANDED,
    CIRCLE_LABEL_RADIUS,
    CIRCLE_START_ANGLE_OFFSET,
} from "./circleOfFifths";


