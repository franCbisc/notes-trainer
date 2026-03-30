/**
 * SettingsPanel – a slide-down settings drawer containing mode, clef and key controls.
 * Triggered by a ⚙ button in the header; closes on outside click or Escape.
 */

import React, { FC, useEffect, useRef } from "react";
import { KEY_SIGNATURE_NAMES } from "../constants";
import type { SettingsPanelProps } from "./types";
import { ClefFilter } from "../types";

const CLEF_OPTIONS: { value: ClefFilter; label: string }[] = [
    { value: "both",   label: "Both" },
    { value: "treble", label: "𝄞 Treble" },
    { value: "bass",   label: "𝄢 Bass" },
];

export const SettingsPanel: FC<SettingsPanelProps> = ({
    open,
    onClose,
    mode,
    onModeChange,
    clefFilter,
    onClefChange,
    selectedKey,
    onKeyChange,
}) => {
    const panelRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        if (!open) return;
        const handle = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handle);
        return () => document.removeEventListener("mousedown", handle);
    }, [open, onClose]);

    // Close on Escape
    useEffect(() => {
        if (!open) return;
        const handle = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", handle);
        return () => document.removeEventListener("keydown", handle);
    }, [open, onClose]);

    return (
        <div className={`settingsPanel${open ? " settingsPanelOpen" : ""}`} ref={panelRef}>
            {/* ── Mode ────────────────────────────────────────────────── */}
            <div className="settingsRow">
                <span className="settingsLabel">Mode</span>
                <div className="settingsToggleGroup">
                    <button
                        className={`settingsToggleBtn${mode === "manual" ? " settingsToggleBtnActive" : ""}`}
                        onClick={() => onModeChange("manual")}
                    >
                        Manual
                    </button>
                    <button
                        className={`settingsToggleBtn${mode === "automatic" ? " settingsToggleBtnActive" : ""}`}
                        onClick={() => onModeChange("automatic")}
                    >
                        Automatic
                    </button>
                </div>
            </div>

            {/* ── Clef ────────────────────────────────────────────────── */}
            <div className="settingsRow">
                <span className="settingsLabel">Clef</span>
                <div className="settingsToggleGroup">
                    {CLEF_OPTIONS.map(({ value, label }) => (
                        <button
                            key={value}
                            className={`settingsToggleBtn${clefFilter === value ? " settingsToggleBtnActive" : ""}`}
                            onClick={() => onClefChange(value)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Key (automatic mode only) ────────────────────────────── */}
            {mode === "automatic" && (
                <div className="settingsRow">
                    <span className="settingsLabel">Key Signature</span>
                    <select
                        className="settingsSelect"
                        value={selectedKey}
                        onChange={(e) => onKeyChange(e.target.value)}
                    >
                        {KEY_SIGNATURE_NAMES.map((name) => (
                            <option key={name} value={name}>{name}</option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
};

SettingsPanel.displayName = "SettingsPanel";

