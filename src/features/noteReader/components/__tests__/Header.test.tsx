import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "../Header";

describe("Header", () => {
    const defaultProps = {
        settingsOpen: false,
        onSettingsToggle: jest.fn(),
        onSettingsClose: jest.fn(),
        mode: "manual" as const,
        onModeChange: jest.fn(),
        clefFilter: "both" as const,
        onClefChange: jest.fn(),
        selectedKey: "Do",
        onKeyChange: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders the title", () => {
        render(<Header {...defaultProps} />);

        expect(screen.getByText("Notes trainer")).toBeInTheDocument();
    });

    it("renders the settings button", () => {
        render(<Header {...defaultProps} />);

        const button = screen.getByRole("button", { name: /settings/i });
        expect(button).toBeInTheDocument();
    });

    it("calls onSettingsToggle when settings button is clicked", () => {
        const onSettingsToggle = jest.fn();
        render(<Header {...defaultProps} onSettingsToggle={onSettingsToggle} />);

        fireEvent.click(screen.getByRole("button", { name: /settings/i }));

        expect(onSettingsToggle).toHaveBeenCalledTimes(1);
    });

    it("opens settings panel when settingsOpen is true", () => {
        render(<Header {...defaultProps} settingsOpen={true} />);

        expect(screen.getByText("Mode")).toBeInTheDocument();
        expect(screen.getByText("Clef")).toBeInTheDocument();
    });

    it("renders mode toggle buttons", () => {
        render(<Header {...defaultProps} settingsOpen={true} />);

        expect(screen.getByText("Manual")).toBeInTheDocument();
        expect(screen.getByText("Automatic")).toBeInTheDocument();
    });

    it("calls onModeChange with 'manual' when manual button is clicked", () => {
        const onModeChange = jest.fn();
        render(<Header {...defaultProps} settingsOpen={true} onModeChange={onModeChange} />);

        fireEvent.click(screen.getByText("Manual"));

        expect(onModeChange).toHaveBeenCalledWith("manual");
    });

    it("calls onModeChange with 'automatic' when automatic button is clicked", () => {
        const onModeChange = jest.fn();
        render(<Header {...defaultProps} settingsOpen={true} onModeChange={onModeChange} />);

        fireEvent.click(screen.getByText("Automatic"));

        expect(onModeChange).toHaveBeenCalledWith("automatic");
    });

    it("renders clef toggle buttons", () => {
        render(<Header {...defaultProps} settingsOpen={true} />);

        expect(screen.getByText("Both")).toBeInTheDocument();
        expect(screen.getByText(/treble/i)).toBeInTheDocument();
        expect(screen.getByText(/bass/i)).toBeInTheDocument();
    });

    it("calls onClefChange with 'treble' when treble button is clicked", () => {
        const onClefChange = jest.fn();
        render(<Header {...defaultProps} settingsOpen={true} onClefChange={onClefChange} />);

        fireEvent.click(screen.getByText(/treble/i));

        expect(onClefChange).toHaveBeenCalledWith("treble");
    });

    it("calls onClefChange with 'bass' when bass button is clicked", () => {
        const onClefChange = jest.fn();
        render(<Header {...defaultProps} settingsOpen={true} onClefChange={onClefChange} />);

        fireEvent.click(screen.getByText(/bass/i));

        expect(onClefChange).toHaveBeenCalledWith("bass");
    });

    it("renders key signature selector in automatic mode", () => {
        render(<Header {...defaultProps} settingsOpen={true} mode="automatic" />);

        expect(screen.getByText("Key Signature")).toBeInTheDocument();
        expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("does not render key signature selector in manual mode", () => {
        render(<Header {...defaultProps} settingsOpen={true} mode="manual" />);

        expect(screen.queryByText("Key Signature")).not.toBeInTheDocument();
    });

    it("calls onKeyChange when key is selected", () => {
        const onKeyChange = jest.fn();
        render(
            <Header
                {...defaultProps}
                settingsOpen={true}
                mode="automatic"
                selectedKey="Do"
                onKeyChange={onKeyChange}
            />
        );

        const select = screen.getByRole("combobox") as HTMLSelectElement;
        fireEvent.change(select, { target: { value: "Fa" } });

        expect(onKeyChange).toHaveBeenCalled();
    });

    it("closes settings panel on Escape key", () => {
        const onSettingsClose = jest.fn();
        render(<Header {...defaultProps} settingsOpen={true} onSettingsClose={onSettingsClose} />);

        fireEvent.keyDown(document, { key: "Escape" });

        expect(onSettingsClose).toHaveBeenCalledTimes(1);
    });

    it("does not close settings panel on other keys", () => {
        const onSettingsClose = jest.fn();
        render(<Header {...defaultProps} settingsOpen={true} onSettingsClose={onSettingsClose} />);

        fireEvent.keyDown(document, { key: "Enter" });

        expect(onSettingsClose).not.toHaveBeenCalled();
    });

    it("does not call onSettingsClose when clicking inside panel", () => {
        const onSettingsClose = jest.fn();
        render(<Header {...defaultProps} settingsOpen={true} onSettingsClose={onSettingsClose} />);

        const panel = document.querySelector(".settingsPanel")!;
        fireEvent.mouseDown(panel);

        expect(onSettingsClose).not.toHaveBeenCalled();
    });

    it("does not call onSettingsClose when clicking on settings button", () => {
        const onSettingsClose = jest.fn();
        render(<Header {...defaultProps} settingsOpen={true} onSettingsClose={onSettingsClose} />);

        const button = document.querySelector(".settingsBtn")!;
        fireEvent.mouseDown(button);

        expect(onSettingsClose).not.toHaveBeenCalled();
    });

    it("calls onSettingsClose when clicking outside panel and button", () => {
        const onSettingsClose = jest.fn();
        render(<Header {...defaultProps} settingsOpen={true} onSettingsClose={onSettingsClose} />);

        fireEvent.mouseDown(document.body);

        expect(onSettingsClose).toHaveBeenCalledTimes(1);
    });

    it("highlights the active mode button", () => {
        const { rerender } = render(<Header {...defaultProps} settingsOpen={true} mode="manual" />);

        expect(screen.getByText("Manual").getAttribute("class")).toContain("settingsToggleBtnActive");

        rerender(<Header {...defaultProps} settingsOpen={true} mode="automatic" />);

        expect(screen.getByText("Automatic").getAttribute("class")).toContain("settingsToggleBtnActive");
    });

    it("highlights the active clef button", () => {
        const { rerender } = render(<Header {...defaultProps} settingsOpen={true} clefFilter="both" />);

        expect(screen.getByText("Both").getAttribute("class")).toContain("settingsToggleBtnActive");

        rerender(<Header {...defaultProps} settingsOpen={true} clefFilter="treble" />);

        expect(screen.getByText(/treble/i).getAttribute("class")).toContain("settingsToggleBtnActive");
    });
});
