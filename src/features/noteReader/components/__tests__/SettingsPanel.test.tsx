import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { SettingsPanel } from "../overlays/SettingsPanel";

const defaultProps = {
    open: true,
    onClose: jest.fn(),
    mode: "manual" as const,
    clefFilter: "both" as const,
    onClefChange: jest.fn(),
};

describe("SettingsPanel", () => {
    beforeEach(() => jest.clearAllMocks());

    it("adds settingsPanelOpen class when open=true", () => {
        const { container } = render(<SettingsPanel {...defaultProps} open={true} />);
        expect(container.firstChild).toHaveClass("settingsPanelOpen");
    });

    it("does not add settingsPanelOpen class when open=false", () => {
        const { container } = render(<SettingsPanel {...defaultProps} open={false} />);
        expect(container.firstChild).not.toHaveClass("settingsPanelOpen");
    });

    it("renders clef as a select dropdown", () => {
        render(<SettingsPanel {...defaultProps} />);
        const select = screen.getByRole("combobox", { name: "" });
        expect(select).toBeInTheDocument();
        expect(select).toHaveValue("both");
    });

    it("calls onClefChange when clef is changed", () => {
        const onClefChange = jest.fn();
        render(<SettingsPanel {...defaultProps} onClefChange={onClefChange} />);
        fireEvent.change(screen.getByRole("combobox", { name: "" }), { target: { value: "treble" } });
        expect(onClefChange).toHaveBeenCalledWith("treble");
    });

    it("renders key hint in automatic mode", () => {
        render(<SettingsPanel {...defaultProps} mode="automatic" />);
        expect(screen.getByText("Use circle below")).toBeInTheDocument();
    });

    it("does not render key hint in manual mode", () => {
        render(<SettingsPanel {...defaultProps} mode="manual" />);
        expect(screen.queryByText("Use circle below")).not.toBeInTheDocument();
    });

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
        fireEvent.mouseDown(screen.getByRole("combobox", { name: "" }));
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
