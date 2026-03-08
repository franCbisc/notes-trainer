import React, { FC } from "react";
import { ClefFilter } from "../types";

interface ClefToggleProps {
    clefFilter: ClefFilter;
    onChange: (filter: ClefFilter) => void;
}

const OPTIONS: { value: ClefFilter; label: string }[] = [
    { value: "both",   label: "Both clefs" },
    { value: "treble", label: "𝄞 Treble" },
    { value: "bass",   label: "𝄢 Bass" },
];

export const ClefToggle: FC<ClefToggleProps> = ({ clefFilter, onChange }) => {
    return (
        <div className="clefToggleButtons">
            {OPTIONS.map(({ value, label }) => (
                <button
                    key={value}
                    className={`clefBtn ${clefFilter === value ? "clefBtnActive" : ""}`}
                    onClick={() => onChange(value)}
                >
                    {label}
                </button>
            ))}
        </div>
    );
};

ClefToggle.displayName = "ClefToggle";
