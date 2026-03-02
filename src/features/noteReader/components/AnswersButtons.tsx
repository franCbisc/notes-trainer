import React, { FC } from "react";
import { AnswersButtonsProps } from "../types";

export const AnswersButtons: FC<AnswersButtonsProps> = ({
    noteNames,
    current,
    selected,
    answered,
    onAnswer,
}) => {
    return (
        <div className="buttonsGrid">
            {noteNames.map((name: string) => {
                const classes = ["btn"];

                if (selected) {
                    if (name === current.name) {
                        classes.push("btnCorrect");
                    } else if (name === selected && answered === "wrong") {
                        classes.push("btnWrong");
                    } else {
                        classes.push("btnDim");
                    }
                }

                return (
                    <button
                        key={name}
                        className={classes.join(" ")}
                        onClick={() => onAnswer(name)}
                        disabled={!!answered}
                    >
                        {name}
                    </button>
                );
            })}
        </div>
    );
};

AnswersButtons.displayName = "AnswersButtons";
