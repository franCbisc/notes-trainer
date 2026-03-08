import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { KeySelector } from "../KeySelector";
import { KEY_SIGNATURE_NAMES } from "../../constants";

/** Wrapper that provides real state so the controlled select reflects value changes */
const ControlledKeySelector = ({ initialKey = "Do", onChange = jest.fn() }) => {
    const [key, setKey] = useState(initialKey);
    return (
        <KeySelector
            selectedKey={key}
            onChange={(k) => { setKey(k); onChange(k); }}
        />
    );
};

describe("KeySelector", () => {
    it("renders a label and a select element", () => {
        render(<KeySelector selectedKey="Do" onChange={jest.fn()} />);
        expect(screen.getByLabelText(/key/i)).toBeInTheDocument();
        expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("renders an option for every key in KEY_SIGNATURE_NAMES", () => {
        render(<KeySelector selectedKey="Do" onChange={jest.fn()} />);
        const options = screen.getAllByRole("option");
        expect(options).toHaveLength(KEY_SIGNATURE_NAMES.length);
        KEY_SIGNATURE_NAMES.forEach((name) => {
            expect(screen.getByRole("option", { name })).toBeInTheDocument();
        });
    });

    it("shows the currently selected key as the selected option", () => {
        render(<ControlledKeySelector initialKey="Re" />);
        expect(screen.getByDisplayValue("Re")).toBeInTheDocument();
    });

    it("calls onChange with the new key when the selection changes", () => {
        const onChange = jest.fn();
        render(<ControlledKeySelector initialKey="Do" onChange={onChange} />);
        fireEvent.change(screen.getByRole("combobox"), { target: { value: "Sol" } });
        expect(onChange).toHaveBeenCalledWith("Sol");
    });
});
