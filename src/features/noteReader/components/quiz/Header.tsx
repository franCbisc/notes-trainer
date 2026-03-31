import React, { FC } from "react";
import type { HeaderProps } from "../types";

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
                    <span className={`modeLabel${mode === "automatic" ? " modeLabelActive" : ""}`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                        </svg>
                        Auto
                    </span>
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
