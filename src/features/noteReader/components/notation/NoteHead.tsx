/**
 * NoteHead component - renders a single note with stem and ledger lines
 */

import { FC, useMemo, type ReactNode } from "react";
import type { NoteHeadProps } from "../../types";
import {
    HALF_SPACING,
    NOTE_X,
    NOTE_HEAD_RX,
    NOTE_HEAD_RY,
    COLORS,
} from "../../constants";

export const NoteHead: FC<NoteHeadProps> = ({ step, cy, answerStatus }) => {
    const answered = answerStatus !== null;
    const correct = answerStatus === "correct";
    const y = cy - step * HALF_SPACING;

    const fill = useMemo(() => {
        if (!answered) return COLORS.noteHead.default;
        return correct ? COLORS.noteHead.correct : COLORS.noteHead.wrong;
    }, [answered, correct]);

    const stemUp = step <= 0;
    const stemX = stemUp ? NOTE_X + NOTE_HEAD_RX - 1 : NOTE_X - NOTE_HEAD_RX + 1;
    const stemY2 = stemUp ? y - 34 : y + 34;

    // Supplementary lines (ledger lines) for notes outside the staff
    const ledgerLines = useMemo(() => {
        const lines: ReactNode[] = [];

        if (step > 4) {
            for (let s = 6; s <= step; s += 2) {
                const ly = cy - s * HALF_SPACING;
                lines.push(
                    <line
                        key={`ledger-${s}`}
                        x1={NOTE_X - NOTE_HEAD_RX - 5}
                        x2={NOTE_X + NOTE_HEAD_RX + 5}
                        y1={ly}
                        y2={ly}
                        stroke={fill}
                        strokeWidth="1.4"
                    />
                );
            }
        } else if (step < -4) {
            for (let s = -6; s >= step; s -= 2) {
                const ly = cy - s * HALF_SPACING;
                lines.push(
                    <line
                        key={`ledger-${s}`}
                        x1={NOTE_X - NOTE_HEAD_RX - 5}
                        x2={NOTE_X + NOTE_HEAD_RX + 5}
                        y1={ly}
                        y2={ly}
                        stroke={fill}
                        strokeWidth="1.4"
                    />
                );
            }
        }

        return lines;
    }, [step, cy, fill]);

    return (
        <g>
            {ledgerLines}
            <line x1={stemX} x2={stemX} y1={y} y2={stemY2} stroke={fill} strokeWidth="1.7" />
            <ellipse
                cx={NOTE_X}
                cy={y}
                rx={NOTE_HEAD_RX}
                ry={NOTE_HEAD_RY}
                fill={fill}
                transform={`rotate(-18,${NOTE_X},${y})`}
            />
        </g>
    );
};

NoteHead.displayName = "NoteHead";

