import { FC } from "react";
import type { MicPermission } from "../../types";

export interface MicPromptProps {
    permission: MicPermission;
    onStartListening: () => Promise<void>;
    onSwitchToManual: () => void;
}

export const MicPrompt: FC<MicPromptProps> = ({
    permission,
    onStartListening,
    onSwitchToManual,
}) => {
    const isDenied = permission === "denied" || permission === "unsupported";

    return (
        <div className="micPrompt">
            {isDenied ? (
                <div className="micDenied">
                    <span className="micIcon">🎙️</span>
                    <p className="micPromptText">
                        {permission === "unsupported"
                            ? "Your browser does not support microphone access."
                            : "Microphone access was denied. Please allow it in your browser settings."}
                    </p>
                    <button className="micBtn micBtnSecondary" onClick={onSwitchToManual}>
                        Switch to manual mode
                    </button>
                </div>
            ) : (
                <div className="micRequest">
                    <span className="micIcon">🎙️</span>
                    <p className="micPromptText">
                        Allow microphone access so the app can listen to your piano.
                    </p>
                    <button
                        className="micBtn"
                        onClick={onStartListening}
                        disabled={permission === "requesting"}
                    >
                        {permission === "requesting" ? "Requesting…" : "Enable microphone"}
                    </button>
                </div>
            )}
        </div>
    );
};

MicPrompt.displayName = "MicPrompt";
