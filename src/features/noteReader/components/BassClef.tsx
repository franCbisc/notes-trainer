/**
 * BassClef component - renders the bass clef symbol (𝄢)
 */

import React, { FC } from "react";
import { BassClefProps } from "../types";
import { LEFT_PADDING, HALF_SPACING, COLORS } from "../constants";

export const BassClef: FC<BassClefProps> = ({ cy }) => {
    const textY = cy + 12 - HALF_SPACING;
    const bassClefChar = "𝄢";

    return (
        <text
            x={LEFT_PADDING}
            y={textY}
            fontSize="40"
            fontFamily="serif"
            fill={COLORS.text.dark}
            style={{ userSelect: "none" }}
        >
            {bassClefChar}
        </text>
    );
};

BassClef.displayName = "BassClef";

