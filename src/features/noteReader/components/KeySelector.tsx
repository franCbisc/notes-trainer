/**
 * KeySelector component
 * A dropdown for selecting the active key signature (shown in automatic mode).
 */

import React, { FC } from "react";
import { KEY_SIGNATURE_NAMES } from "../constants";

interface KeySelectorProps {
    selectedKey: string;
    onChange: (key: string) => void;
}

export const KeySelector: FC<KeySelectorProps> = ({ selectedKey, onChange }) => {
    return (
        <div className="keySelectorRow">
            <label className="keySelectorLabel" htmlFor="keySelect">
                🎼 Key
            </label>
            <select
                id="keySelect"
                className="keySelectorSelect"
                value={selectedKey}
                onChange={(e) => onChange(e.target.value)}
            >
                {KEY_SIGNATURE_NAMES.map((name) => (
                    <option key={name} value={name}>
                        {name}
                    </option>
                ))}
            </select>
        </div>
    );
};

KeySelector.displayName = "KeySelector";

