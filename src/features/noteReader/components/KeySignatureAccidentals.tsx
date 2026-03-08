/**
 * KeySignatureAccidentals component
 * Renders ♯ / ♭ glyphs on both staves at the conventional positions
 * for the selected key signature.
 */

import React, { FC } from "react";
import { KeyAccidental } from "../types";
import { TREBLE_CY, BASS_CY, HALF_SPACING, COLORS } from "../constants";

interface KeySignatureAccidentalsProps {
    accidentals: KeyAccidental[];
}

/** Horizontal start position for the first accidental glyph */
const KEY_SIG_X_START = 62;
/** Horizontal spacing between accidental glyphs */
const KEY_SIG_X_STEP = 12;

export const KeySignatureAccidentals: FC<KeySignatureAccidentalsProps> = ({ accidentals }) => {
    if (accidentals.length === 0) return null;

    return (
        <g>
            {accidentals.map((acc, i) => {
                const x = KEY_SIG_X_START + i * KEY_SIG_X_STEP;
                const trebleY = TREBLE_CY - acc.trebleStep * HALF_SPACING;
                const bassY = BASS_CY - acc.bassStep * HALF_SPACING;
                const glyph = acc.accidental === "#" ? "♯" : "♭";
                // Flats sit a bit higher visually than sharps due to glyph shape
                const dySharp = 5;
                const dyFlat = 9;
                const dy = acc.accidental === "#" ? dySharp : dyFlat;

                return (
                    <g key={`${acc.baseName}-${acc.accidental}-${i}`}>
                        <text
                            x={x}
                            y={trebleY + dy}
                            textAnchor="middle"
                            fontSize="14"
                            fontFamily="serif"
                            fill={COLORS.text.dark}
                        >
                            {glyph}
                        </text>
                        <text
                            x={x}
                            y={bassY + dy}
                            textAnchor="middle"
                            fontSize="14"
                            fontFamily="serif"
                            fill={COLORS.text.dark}
                        >
                            {glyph}
                        </text>
                    </g>
                );
            })}
        </g>
    );
};

KeySignatureAccidentals.displayName = "KeySignatureAccidentals";

