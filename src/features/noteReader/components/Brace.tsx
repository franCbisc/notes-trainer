/**
 * Brace component - renders the left curly brace connecting treble and bass staves
 */

import React, { FC } from "react";
import { BraceProps } from "../types";
import { COLORS } from "../constants";

export const Brace: FC<BraceProps> = ({ topY, botY }) => {
    const height = botY - topY;
    const x = 4; // padding from the left edge

    const BASE_SIZE = 50; // round reference size
    // scale in y dimension so the glyph's em-box matches our required height
    const scaleY = height / BASE_SIZE * 1.15;

    // We align the brace at the **top** of the staff; using a hanging baseline
    // ensures the glyph's top sits exactly at the group origin. The vertical
    // transform stretches it downward to reach botY.
    return (
        <g transform={`translate(${x},${topY}) scale(1,${scaleY})`}>            <text
                x={0}
                y={-2}
                fontSize={BASE_SIZE}
                fontFamily="serif"
                fill={COLORS.stroke.brace}
                textAnchor="start"
                dominantBaseline="hanging"
                style={{ userSelect: "none", pointerEvents: "none" }}
            >
                {'{'}
            </text>
        </g>
    );
};

Brace.displayName = "Brace";
