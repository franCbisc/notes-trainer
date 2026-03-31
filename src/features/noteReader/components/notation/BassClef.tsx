/**
 * BassClef component - renders the bass clef symbol (𝄢)
 */

import { FC } from "react";
import { STAFF_PADDING, COLORS } from "../../constants";

export const BassClef: FC = () => {
    const bassClefChar = "𝄢";

    return (
        <text
            x={STAFF_PADDING + 20}
            y={243}
            fontSize="55"
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

