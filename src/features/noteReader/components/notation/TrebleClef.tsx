/**
 * TrebleClef component - renders the treble clef symbol (𝄞)
 */

import React, { FC } from "react";
import type { TrebleClefProps } from "../../types";
import { STAFF_PADDING, COLORS } from "../../constants";

export const TrebleClef: FC<TrebleClefProps> = ({ cy }) => {
    const textY = cy + 15;
    const trebleClefChar = "𝄞";

    return (
        <text
            x={STAFF_PADDING + 20}
            y={textY}
            fontSize="55"
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

