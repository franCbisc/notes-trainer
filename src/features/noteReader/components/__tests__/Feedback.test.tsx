import { render, screen } from "@testing-library/react";
import { Feedback } from "../quiz/Feedback";

describe("Feedback", () => {
    it("renders nothing when answered is null", () => {
        render(
            <Feedback
                answered={null}
                mode="automatic"
                selected={null}
            />
        );

        expect(document.querySelector(".wrong")).not.toBeInTheDocument();
    });

    it("renders nothing when answered is correct", () => {
        render(
            <Feedback
                answered="correct"
                mode="automatic"
                selected="Do"
            />
        );

        expect(document.querySelector(".wrong")).not.toBeInTheDocument();
    });

    it("renders wrong feedback in automatic mode", () => {
        render(
            <Feedback
                answered="wrong"
                mode="automatic"
                selected="Re"
            />
        );

        expect(screen.getByText(/You played/)).toBeInTheDocument();
        expect(screen.getByText("Re")).toBeInTheDocument();
    });

    it("does not render wrong feedback in manual mode", () => {
        render(
            <Feedback
                answered="wrong"
                mode="manual"
                selected="Re"
            />
        );

        expect(document.querySelector(".wrong")).not.toBeInTheDocument();
    });

    it("does not render when selected is null", () => {
        render(
            <Feedback
                answered="wrong"
                mode="automatic"
                selected={null}
            />
        );

        expect(document.querySelector(".wrong")).not.toBeInTheDocument();
    });
});
