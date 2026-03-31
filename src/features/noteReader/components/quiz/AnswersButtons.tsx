import { FC } from "react";
import type { AnswersButtonsProps } from "../../types";

export const AnswersButtons: FC<AnswersButtonsProps> = ({
    noteNames,
    selected,
    answered,
    onAnswer,
}) => {
    return (
        <div className="buttonsGrid">
            {noteNames.map((name: string) => {
                const classes = ["btn"];

                if (name === selected) {
                    classes.push(answered === "wrong" ? "btnWrong" : "btnCorrect");
                }

                return (
                    <button
                        key={name}
                        className={classes.join(" ")}
                        onClick={() => onAnswer(name)}
                        disabled={answered === "correct"}
                    >
                        {name}
                    </button>
                );
            })}
        </div>
    );
};

AnswersButtons.displayName = "AnswersButtons";
