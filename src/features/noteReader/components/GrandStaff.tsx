/**
 * GrandStaff component - assembles treble and bass staves with clefs and note
 */

import React, { FC } from "react";
import { GrandStaffProps } from "./types";
import { StaffLines } from "./StaffLines";
import { NoteHead } from "./NoteHead";
import { TrebleClef } from "./TrebleClef";
import { BassClef } from "./BassClef";
import { KeySignatureAccidentals } from "./KeySignatureAccidentals";
import { SVG_WIDTH, STAFF_HEIGHT, STAFF_PADDING, TREBLE_CY, BASS_CY, HALF_SPACING, COLORS } from "../constants";

export const GrandStaff: FC<GrandStaffProps> = ({ current, answered, correct, keyAccidentals = [] }) => {
    const answerStatus = answered ? (correct ? "correct" : "wrong") : null;
    const topY = TREBLE_CY - 4 * HALF_SPACING;
    const botY = BASS_CY + 4 * HALF_SPACING;

    return (
        <svg
            viewBox={`0 0 ${SVG_WIDTH} ${STAFF_HEIGHT}`}
            style={{ display: "block", width: "100%" }}
        >

            {/* Left vertical line connecting both staves */}
            <line x1={STAFF_PADDING - 2} x2={STAFF_PADDING - 2} y1={topY} y2={botY} stroke={COLORS.stroke.brace} strokeWidth="2" />

            {/* Staff lines for both clefs */}
            <StaffLines cy={TREBLE_CY} />
            <StaffLines cy={BASS_CY} />

            {/* Clef symbols */}
            <TrebleClef cy={TREBLE_CY} />
            <BassClef cy={BASS_CY} />

            {/* Key signature accidentals */}
            <KeySignatureAccidentals accidentals={keyAccidentals} />

            {/* Current note - rendered on the appropriate staff */}
            {current.clef === "treble" && (
                <NoteHead step={current.step} cy={TREBLE_CY} answerStatus={answerStatus} />
            )}
            {current.clef === "bass" && (
                <NoteHead step={current.step} cy={BASS_CY} answerStatus={answerStatus} />
            )}
        </svg>
    );
};

GrandStaff.displayName = "GrandStaff";
