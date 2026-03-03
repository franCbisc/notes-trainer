import React, { FC } from "react";

interface ModeToggleProps {
    mode: "manual" | "automatic";
    onChange: (mode: "manual" | "automatic") => void;
    disabled?: boolean;
}

export const ModeToggle: FC<ModeToggleProps> = ({ mode, onChange, disabled = false }) => {
    return (
        <div className="modeToggleContainer">
            <label className="modeToggleLabel">Mode:</label>
            <div className="modeToggleButtons">
                <button
                    className={`modeBtn ${mode === "manual" ? "modeBtnActive" : ""}`}
                    onClick={() => onChange("manual")}
                    disabled={disabled}
                >
                    Manual
                </button>
                <button
                    className={`modeBtn ${mode === "automatic" ? "modeBtnActive" : ""}`}
                    onClick={() => onChange("automatic")}
                    disabled={disabled}
                >
                    Automatic (MVP)
                </button>
            </div>
        </div>
    );
};

ModeToggle.displayName = "ModeToggle";

