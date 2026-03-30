import React, { FC, useRef, useEffect } from "react";
import { ClefFilter } from "../types";
import { KEY_SIGNATURE_NAMES } from "../constants";
import { SettingsIcon } from "./SettingsIcon";

interface HeaderProps {
    settingsOpen: boolean;
    onSettingsToggle: () => void;
    onSettingsClose: () => void;
    mode: "manual" | "automatic";
    onModeChange: (mode: "manual" | "automatic") => void;
    clefFilter: ClefFilter;
    onClefChange: (clef: ClefFilter) => void;
    selectedKey: string;
    onKeyChange: (key: string) => void;
}

const CLEF_OPTIONS: { value: ClefFilter; label: string }[] = [
    { value: "both",   label: "Both" },
    { value: "treble", label: "𝄞 Treble" },
    { value: "bass",   label: "𝄢 Bass" },
];

export const Header: FC<HeaderProps> = ({
    settingsOpen,
    onSettingsToggle,
    onSettingsClose,
    mode,
    onModeChange,
    clefFilter,
    onClefChange,
    selectedKey,
    onKeyChange,
}) => {
    const settingsBtnRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!settingsOpen) return;
        const handle = (e: MouseEvent) => {
            if (
                panelRef.current &&
                !panelRef.current.contains(e.target as Node) &&
                !settingsBtnRef.current?.contains(e.target as Node)
            ) {
                onSettingsClose();
            }
        };
        document.addEventListener("mousedown", handle);
        return () => document.removeEventListener("mousedown", handle);
    }, [settingsOpen, onSettingsClose]);

    useEffect(() => {
        if (!settingsOpen) return;
        const handle = (e: KeyboardEvent) => { if (e.key === "Escape") onSettingsClose(); };
        document.addEventListener("keydown", handle);
        return () => document.removeEventListener("keydown", handle);
    }, [settingsOpen, onSettingsClose]);

    return (
        <header className="header">
            <div className="settingsAnchor">
                <button
                    ref={settingsBtnRef}
                    className={`settingsBtn${settingsOpen ? " settingsBtnActive" : ""}`}
                    onClick={onSettingsToggle}
                    aria-label="Settings"
                    aria-expanded={settingsOpen}
                >
                    <SettingsIcon />
                </button>
                <div className={`settingsPanel${settingsOpen ? " settingsPanelOpen" : ""}`} ref={panelRef}>
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
            </div>
            <h1 className="title">Notes trainer</h1>
            <div className="headerSpacer" aria-hidden="true" />
        </header>
    );
};

Header.displayName = "Header";
