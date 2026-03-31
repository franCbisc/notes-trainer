import { render } from "@testing-library/react";
import { SettingsIcon } from "../overlays/SettingsIcon";

describe("SettingsIcon", () => {
    it("renders without errors", () => {
        const { container } = render(<SettingsIcon />);

        const svg = container.querySelector("svg");
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute("viewBox", "0 0 20 20");
        expect(svg).toHaveAttribute("aria-hidden", "true");
    });
});
