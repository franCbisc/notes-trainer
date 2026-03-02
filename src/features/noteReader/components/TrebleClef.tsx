/**
 * TrebleClef component - renders the treble clef symbol (𝄞)
 */

import React, { FC } from "react";
import { TrebleClefProps } from "../types";
import { STAFF_PADDING, HALF_SPACING, COLORS } from "../constants";

export const TrebleClef: FC<TrebleClefProps> = ({ cy }) => {
    const textY = cy + 15;
    const trebleClefChar = "𝄞";

    return (
        <text
            x={STAFF_PADDING + 15}
            y={textY}
            fontSize="35"
            fontFamily="'Noto Music', serif"
            fill={COLORS.text.dark}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ userSelect: "none" }}
        >
            {trebleClefChar}
        </text>
    );
};

TrebleClef.displayName = "TrebleClef";

