import { FC } from "react";
import type { AnswerStatus } from "../types";

export interface FeedbackProps {
    answered: AnswerStatus;
    mode: "manual" | "automatic";
    selected: string | null;
}

export const Feedback: FC<FeedbackProps> = ({
    answered,
    mode,
    selected,
}) => {
    const showWrong = answered === "wrong" && mode === "automatic" && selected;

    return (
        <div className="feedback" style={{ opacity: answered ? 1 : 0, pointerEvents: "none" }}>
            {showWrong && (
                <span className="wrong">✗ You played <strong>{selected}</strong></span>
            )}
        </div>
    );
};

Feedback.displayName = "Feedback";
