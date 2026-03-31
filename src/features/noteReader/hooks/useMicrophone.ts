/**
 * Hook for managing microphone access (getUserMedia + AudioContext lifecycle).
 *
 * Exposes:
 *   - `permission`: "idle" | "requesting" | "granted" | "denied" | "unsupported"
 *   - `audioContext`: the running AudioContext (null until granted)
 *   - `mediaStream`: the raw MediaStream (null until granted)
 *   - `requestMic()`: triggers the browser permission prompt
 *   - `releaseMic()`: stops the stream and closes the AudioContext
 */

import { useState, useCallback, useRef, useEffect } from "react";

export type MicPermission = "idle" | "requesting" | "granted" | "denied" | "unsupported";

export interface UseMicrophoneReturn {
    permission: MicPermission;
    audioContext: AudioContext | null;
    mediaStream: MediaStream | null;
    requestMic: () => Promise<MicPermission>;
    releaseMic: () => void;
}

export function useMicrophone(): UseMicrophoneReturn {
    const [permission, setPermission] = useState<MicPermission>("idle");
    const audioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);

    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

    const releaseMic = useCallback(() => {
        mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
        setMediaStream(null);

        audioContextRef.current?.close();
        audioContextRef.current = null;
        setAudioContext(null);
    }, []);

    const requestMic = useCallback(async (): Promise<MicPermission> => {
        if (!navigator?.mediaDevices?.getUserMedia) {
            setPermission("unsupported");
            return "unsupported";
        }

        setPermission("requesting");

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            let ctx: AudioContext | null = null;
            try {
                ctx = new AudioContext();
            } catch {
                stream.getTracks().forEach((t) => t.stop());
                setPermission("denied");
                return "denied";
            }

            mediaStreamRef.current = stream;
            audioContextRef.current = ctx;

            setMediaStream(stream);
            setAudioContext(ctx);
            setPermission("granted");
            return "granted";
        } catch {
            setPermission("denied");
            return "denied";
        }
    }, []);

    useEffect(() => {
        return () => {
            mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
            audioContextRef.current?.close();
        };
    }, []);

    return { permission, audioContext, mediaStream, requestMic, releaseMic };
}
