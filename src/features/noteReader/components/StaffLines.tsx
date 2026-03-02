/**
 * StaffLines component - renders the 5 lines of a musical staff
 */

import React, { FC } from "react";
import { StaffLinesProps } from "../types";
import { HALF_SPACING, STAFF_PADDING, SVG_WIDTH, COLORS } from "../constants";

export const StaffLines: FC<StaffLinesProps> = ({ cy }) => {
    return (
        <>
            {[-4, -2, 0, 2, 4].map((step) => {
                const y = cy - step * HALF_SPACING;
                return (
                    <line
                        key={`staff-line-${step}`}
                        x1={STAFF_PADDING}
                        x2={SVG_WIDTH - STAFF_PADDING}
                        y1={y}
                        y2={y}
                        stroke={COLORS.stroke.staff}
                        strokeWidth="1.3"
                    />
                );
            })}
        </>
    );
};

StaffLines.displayName = "StaffLines";

