import React, { FC } from "react";
import type { HeaderProps } from "./types";

export const Header: FC<HeaderProps> = ({
    mode,
    onModeChange,
    clefFilter,
    onClefChange,
}) => {
    return (
        <header className="header">
            <div className="headerLeft">
                <div className="modeSwitch">
                    <span className={`modeLabel${mode === "manual" ? " modeLabelActive" : ""}`}>Manual</span>
                    <button
                        className="modeToggle"
                        onClick={() => onModeChange(mode === "manual" ? "automatic" : "manual")}
                        aria-label={`Switch to ${mode === "manual" ? "automatic" : "manual"} mode`}
                    >
                        <span className={`modeToggleKnob${mode === "automatic" ? " modeToggleKnobOn" : ""}`} />
                    </button>
                    <span className={`modeLabel${mode === "automatic" ? " modeLabelActive" : ""}`}>Auto</span>
                </div>
            </div>

            <div className="headerRight">
                <div className="clefButtons">
                    <button
                        className={`clefBtn${clefFilter === "both" ? " clefBtnActive" : ""}`}
                        onClick={() => onClefChange("both")}
                        aria-pressed={clefFilter === "both"}
                    >
                        Both
                    </button>
                    <button
                        className={`clefBtn${clefFilter === "treble" ? " clefBtnActive" : ""}`}
                        onClick={() => onClefChange("treble")}
                        aria-pressed={clefFilter === "treble"}
                    >
                        <span className="clefBtnSymbol">𝄞</span>
                    </button>
                    <button
                        className={`clefBtn${clefFilter === "bass" ? " clefBtnActive" : ""}`}
                        onClick={() => onClefChange("bass")}
                        aria-pressed={clefFilter === "bass"}
                    >
                        <span className="clefBtnSymbol">𝄢</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

Header.displayName = "Header";
