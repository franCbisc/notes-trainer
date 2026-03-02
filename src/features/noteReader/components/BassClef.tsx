/**
 * BassClef component - renders the bass clef symbol (𝄢)
 */

import React, { FC } from "react";
import { BassClefProps } from "../types";
import { LEFT_PADDING, COLORS } from "../constants";

export const BassClef: FC<BassClefProps> = ({ cy }) => {
    const textY = cy;
    const bassClefChar = "𝄢";

    return (
        <text
            x={LEFT_PADDING + 15}
            y={textY}
            fontSize="35"
            fontFamily="'Noto Music', serif"
            fill={COLORS.text.dark}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ userSelect: "none" }}
        >
            {bassClefChar}
        </text>
    );
};

BassClef.displayName = "BassClef";

