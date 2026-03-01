/**
 * GrandStaff component - assembles treble and bass staves with clefs and note
 * This is a pure presentation component that doesn't contain any quiz logic
 */

import React, { FC } from "react";
import { GrandStaffProps } from "../types";
import { StaffLines } from "./StaffLines";
import { NoteHead } from "./NoteHead";
import { Brace } from "./Brace";
import { TrebleClef } from "./TrebleClef";
import { BassClef } from "./BassClef";
import { SVG_WIDTH, STAFF_HEIGHT, TREBLE_CY, BASS_CY, HALF_SPACING, LEFT_PADDING } from "../constants";

export const GrandStaff: FC<GrandStaffProps> = ({ current, answered, correct }) => {
    const topY = TREBLE_CY - 4 * HALF_SPACING;
    const botY = BASS_CY + 4 * HALF_SPACING;

    return (
        <svg
            width={SVG_WIDTH}
            height={STAFF_HEIGHT}
            viewBox={`0 0 ${SVG_WIDTH} ${STAFF_HEIGHT}`}
        >
            {/* Brace connecting the two staves */}
            <Brace topY={topY} botY={botY} />

            {/* Left vertical line connecting both staves */}
            <line x1={LEFT_PADDING - 2} x2={LEFT_PADDING - 2} y1={topY} y2={botY} stroke="#444" strokeWidth="2" />

            {/* Staff lines for both clefs */}
            <StaffLines cy={TREBLE_CY} />
            <StaffLines cy={BASS_CY} />

            {/* Clef symbols */}
            <TrebleClef cy={TREBLE_CY} />
            <BassClef cy={BASS_CY} />

            {/* Current note - rendered on the appropriate staff */}
            {current.clef === "treble" && (
                <NoteHead step={current.step} cy={TREBLE_CY} answered={answered} correct={correct} />
            )}
            {current.clef === "bass" && (
                <NoteHead step={current.step} cy={BASS_CY} answered={answered} correct={correct} />
            )}
        </svg>
    );
};

GrandStaff.displayName = "GrandStaff";

