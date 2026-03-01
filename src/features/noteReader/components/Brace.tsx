/**
 * Brace component - renders the left curly brace connecting treble and bass staves
 */

import React, { FC } from "react";
import { BraceProps } from "../types";
import { COLORS } from "../constants";

export const Brace: FC<BraceProps> = ({ topY, botY }) => {
    const h = botY - topY;
    const x = 40;

    const midY = topY + h / 2;
    const upperMidY = topY + h * 0.35;
    const upperInnerY = topY + h * 0.18;
    const lowerMidY = botY - h * 0.35;
    const lowerInnerY = botY - h * 0.18;

    const midOut = 20;
    const midIn = 10;
    const endOut = 7;
    const endIn = 9;
    const hookOut = 1;
    const hookDown = 4;

    const pathD = `M${x},${midY}
          C${x + midOut},${upperMidY} ${x - midIn},${upperInnerY} ${x},${topY}
          C${x + endOut},${topY} ${x + endOut},${topY} ${x + hookOut},${topY + hookDown}
          C${x - endIn},${upperInnerY} ${x + midIn},${upperMidY} ${x},${midY}
          C${x + midIn},${lowerMidY} ${x - endIn},${lowerInnerY} ${x + hookOut},${botY - hookDown}
          C${x + endOut},${botY} ${x + endOut},${botY} ${x},${botY}
          C${x - midIn},${lowerInnerY} ${x + midOut},${lowerMidY} ${x},${midY}
          Z`;

    return <path d={pathD} fill={COLORS.stroke.brace} />;
};

Brace.displayName = "Brace";
