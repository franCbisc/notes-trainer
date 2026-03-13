import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { SettingsPanel } from "../SettingsPanel";

const defaultProps = {
    open: true,
    onClose: jest.fn(),
    mode: "manual" as const,
    onModeChange: jest.fn(),
    clefFilter: "both" as const,
    onClefChange: jest.fn(),
    selectedKey: "Do",
    onKeyChange: jest.fn(),
};

describe("SettingsPanel", () => {
    beforeEach(() => jest.clearAllMocks());

    // ── Visibility ───────────────────────────────────────────────────────────

    it("adds settingsPanelOpen class when open=true", () => {
        const { container } = render(<SettingsPanel {...defaultProps} open={true} />);
        expect(container.firstChild).toHaveClass("settingsPanelOpen");
    });

    it("does not add settingsPanelOpen class when open=false", () => {
        const { container } = render(<SettingsPanel {...defaultProps} open={false} />);
        expect(container.firstChild).not.toHaveClass("settingsPanelOpen");
    });

    // ── Mode buttons ─────────────────────────────────────────────────────────

    it("marks Manual button active when mode=manual", () => {
        render(<SettingsPanel {...defaultProps} mode="manual" />);
        expect(screen.getByRole("button", { name: "Manual" })).toHaveClass("settingsToggleBtnActive");
        expect(screen.getByRole("button", { name: "Automatic" })).not.toHaveClass("settingsToggleBtnActive");
    });

    it("marks Automatic button active when mode=automatic", () => {
        render(<SettingsPanel {...defaultProps} mode="automatic" />);
        expect(screen.getByRole("button", { name: "Automatic" })).toHaveClass("settingsToggleBtnActive");
        expect(screen.getByRole("button", { name: "Manual" })).not.toHaveClass("settingsToggleBtnActive");
    });

    it("calls onModeChange('manual') when Manual is clicked", () => {
        const onModeChange = jest.fn();
        render(<SettingsPanel {...defaultProps} onModeChange={onModeChange} />);
        fireEvent.click(screen.getByRole("button", { name: "Manual" }));
        expect(onModeChange).toHaveBeenCalledWith("manual");
    });

    it("calls onModeChange('automatic') when Automatic is clicked", () => {
        const onModeChange = jest.fn();
        render(<SettingsPanel {...defaultProps} onModeChange={onModeChange} />);
        fireEvent.click(screen.getByRole("button", { name: "Automatic" }));
        expect(onModeChange).toHaveBeenCalledWith("automatic");
    });

    // ── Clef buttons ─────────────────────────────────────────────────────────

    it("renders the three clef options", () => {
        render(<SettingsPanel {...defaultProps} />);
        expect(screen.getByRole("button", { name: "Both" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Treble/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Bass/i })).toBeInTheDocument();
    });

    it("marks the active clef button", () => {
        render(<SettingsPanel {...defaultProps} clefFilter="treble" />);
        expect(screen.getByRole("button", { name: /Treble/i })).toHaveClass("settingsToggleBtnActive");
        expect(screen.getByRole("button", { name: "Both" })).not.toHaveClass("settingsToggleBtnActive");
    });

    it("calls onClefChange with the correct value when a clef button is clicked", () => {
        const onClefChange = jest.fn();
        render(<SettingsPanel {...defaultProps} onClefChange={onClefChange} />);
        fireEvent.click(screen.getByRole("button", { name: /Bass/i }));
        expect(onClefChange).toHaveBeenCalledWith("bass");
    });

    // ── Key selector ─────────────────────────────────────────────────────────

    it("does not render the key selector in manual mode", () => {
        render(<SettingsPanel {...defaultProps} mode="manual" />);
        expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    });

    it("renders the key selector in automatic mode", () => {
        render(<SettingsPanel {...defaultProps} mode="automatic" />);
        expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("calls onKeyChange when the key selector changes", () => {
        const onKeyChange = jest.fn();
        const Wrapper = () => {
            const [key, setKey] = useState("Do");
            return (
                <SettingsPanel
                    {...defaultProps}
                    mode="automatic"
                    selectedKey={key}
                    onKeyChange={(k) => { setKey(k); onKeyChange(k); }}
                />
            );
        };
        render(<Wrapper />);
        fireEvent.change(screen.getByRole("combobox"), { target: { value: "Re - Sim" } });
        expect(onKeyChange).toHaveBeenCalledWith("Re - Sim");
    });

    // ── Outside click ─────────────────────────────────────────────────────────

    it("calls onClose when clicking outside the panel", () => {
        const onClose = jest.fn();
        render(
            <div>
                <SettingsPanel {...defaultProps} onClose={onClose} />
                <button>Outside</button>
            </div>
        );
        fireEvent.mouseDown(screen.getByRole("button", { name: "Outside" }));
        expect(onClose).toHaveBeenCalled();
    });

    it("does not call onClose when clicking inside the panel", () => {
        const onClose = jest.fn();
        render(<SettingsPanel {...defaultProps} onClose={onClose} />);
        fireEvent.mouseDown(screen.getByRole("button", { name: "Manual" }));
        expect(onClose).not.toHaveBeenCalled();
    });

    it("does not register outside-click listener when closed", () => {
        const onClose = jest.fn();
        render(
            <div>
                <SettingsPanel {...defaultProps} open={false} onClose={onClose} />
                <button>Outside</button>
            </div>
        );
        fireEvent.mouseDown(screen.getByRole("button", { name: "Outside" }));
        expect(onClose).not.toHaveBeenCalled();
    });

    // ── Escape key ────────────────────────────────────────────────────────────

    it("calls onClose when Escape is pressed", () => {
        const onClose = jest.fn();
        render(<SettingsPanel {...defaultProps} onClose={onClose} />);
        fireEvent.keyDown(document, { key: "Escape" });
        expect(onClose).toHaveBeenCalled();
    });

    it("does not call onClose for other keys", () => {
        const onClose = jest.fn();
        render(<SettingsPanel {...defaultProps} onClose={onClose} />);
        fireEvent.keyDown(document, { key: "Enter" });
        expect(onClose).not.toHaveBeenCalled();
    });

    it("does not register Escape listener when closed", () => {
        const onClose = jest.fn();
        render(<SettingsPanel {...defaultProps} open={false} onClose={onClose} />);
        fireEvent.keyDown(document, { key: "Escape" });
        expect(onClose).not.toHaveBeenCalled();
    });
});

