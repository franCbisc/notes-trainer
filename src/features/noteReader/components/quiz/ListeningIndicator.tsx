import { FC } from "react";
import type { DetectedPitch } from "../../types";

export interface ListeningIndicatorProps {
    isListening: boolean;
    detectedPitch: DetectedPitch | null;
}

export const ListeningIndicator: FC<ListeningIndicatorProps> = ({
    isListening,
    detectedPitch,
}) => {
    return (
        <div className="listeningIndicator">
            {isListening && <span className="listeningDot" />}
            <span>{isListening ? "Listening…" : "Ready"}</span>
            {detectedPitch && (
                <span className="pitchDebug">
                    {Math.round(detectedPitch.frequency)} Hz · {Math.round(detectedPitch.clarity * 100)}%
                </span>
            )}
        </div>
    );
};

ListeningIndicator.displayName = "ListeningIndicator";
