import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MicPrompt } from "../MicPrompt";

describe("MicPrompt", () => {
    const defaultProps = {
        onStartListening: jest.fn(),
        onSwitchToManual: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders the request prompt when permission is idle", () => {
        render(<MicPrompt {...defaultProps} permission="idle" />);

        expect(screen.getByText(/Allow microphone access so the app can listen to your piano/i)).toBeInTheDocument();
        expect(screen.getByText("Enable microphone")).toBeInTheDocument();
    });

    it("renders the request prompt when permission is requesting", () => {
        render(<MicPrompt {...defaultProps} permission="requesting" />);

        expect(screen.getByText("Requesting…")).toBeInTheDocument();
    });

    it("calls onStartListening when the enable microphone button is clicked", () => {
        const onStartListening = jest.fn();
        render(<MicPrompt {...defaultProps} permission="idle" onStartListening={onStartListening} />);

        fireEvent.click(screen.getByText("Enable microphone"));

        expect(onStartListening).toHaveBeenCalledTimes(1);
    });

    it("disables the button when permission is requesting", () => {
        render(<MicPrompt {...defaultProps} permission="requesting" />);

        expect(screen.getByRole("button", { name: /requesting/i })).toBeDisabled();
    });

    it("renders the denied prompt when permission is denied", () => {
        render(<MicPrompt {...defaultProps} permission="denied" />);

        expect(screen.getByText(/Microphone access was denied/i)).toBeInTheDocument();
        expect(screen.getByText("Switch to manual mode")).toBeInTheDocument();
    });

    it("renders the unsupported prompt when permission is unsupported", () => {
        render(<MicPrompt {...defaultProps} permission="unsupported" />);

        expect(screen.getByText(/does not support microphone access/i)).toBeInTheDocument();
        expect(screen.getByText("Switch to manual mode")).toBeInTheDocument();
    });

    it("calls onSwitchToManual when the switch button is clicked", () => {
        const onSwitchToManual = jest.fn();
        render(<MicPrompt {...defaultProps} permission="denied" onSwitchToManual={onSwitchToManual} />);

        fireEvent.click(screen.getByText("Switch to manual mode"));

        expect(onSwitchToManual).toHaveBeenCalledTimes(1);
    });

    it("renders the microphone request UI when permission is granted (parent controls visibility)", () => {
        // Note: MicPrompt itself renders based on permission type, not visibility.
        // The parent component (NoteReaderPage) controls whether to render MicPrompt
        // at all based on showMicPrompt (which is false when permission is granted).
        render(<MicPrompt {...defaultProps} permission="granted" />);

        // When granted, the component shows the request UI (this is edge case behavior)
        expect(screen.getByText(/Allow microphone access/i)).toBeInTheDocument();
    });

    it("renders the microphone icon", () => {
        render(<MicPrompt {...defaultProps} permission="idle" />);

        expect(screen.getByText("🎙️")).toBeInTheDocument();
    });
});
