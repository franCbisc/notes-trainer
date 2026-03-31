/**
 * SettingsPanel – a slide-down settings drawer containing clef and key controls.
 * Triggered by a ⚙ button in the header; closes on outside click or Escape.
 */

import { FC, useEffect, useRef } from "react";
import type { SettingsPanelProps } from "../../types";

export const SettingsPanel: FC<SettingsPanelProps> = ({
    open,
    onClose,
    mode,
    clefFilter,
    onClefChange,
}) => {
    const panelRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        if (!open) return;
        const handle = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", handle);
        return () => document.removeEventListener("keydown", handle);
    }, [open, onClose]);

    return (
        <div className={`settingsPanel${open ? " settingsPanelOpen" : ""}`} ref={panelRef}>
            <div className="settingsRow">
                <span className="settingsLabel">Clef</span>
                <select
                    className="settingsSelect"
                    value={clefFilter}
                    onChange={(e) => onClefChange(e.target.value as "both" | "treble" | "bass")}
                >
                    <option value="both">Both</option>
                    <option value="treble">𝄞 Treble</option>
                    <option value="bass">𝄢 Bass</option>
                </select>
            </div>

            {mode === "automatic" && (
                <div className="settingsRow">
                    <span className="settingsLabel">Key</span>
                    <span className="settingsHint">Use circle below</span>
                </div>
            )}
        </div>
    );
};

SettingsPanel.displayName = "SettingsPanel";

