/**
 * TrebleClef component - renders the treble clef symbol (𝄞)
 */

import React, { FC } from "react";
import { TrebleClefProps } from "../types";
import { LEFT_PADDING, HALF_SPACING, COLORS } from "../constants";

export const TrebleClef: FC<TrebleClefProps> = ({ cy }) => {
    const textY = cy + 36 - HALF_SPACING;
    const trebleClefChar = "𝄞";

    return (
        <text
            x={LEFT_PADDING}
            y={textY}
            fontSize="72"
            fontFamily="serif"
            fill={COLORS.text.dark}
            style={{ userSelect: "none" }}
        >
            {trebleClefChar}
        </text>
    );
};

TrebleClef.displayName = "TrebleClef";

