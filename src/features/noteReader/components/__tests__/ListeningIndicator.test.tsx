import { render, screen } from "@testing-library/react";
import { ListeningIndicator } from "../quiz/ListeningIndicator";

describe("ListeningIndicator", () => {
    it("renders Ready when not listening", () => {
        render(
            <ListeningIndicator
                isListening={false}
                detectedPitch={null}
            />
        );

        expect(screen.getByText("Ready")).toBeInTheDocument();
    });

    it("renders Listening when listening", () => {
        render(
            <ListeningIndicator
                isListening={true}
                detectedPitch={null}
            />
        );

        expect(screen.getByText("Listening…")).toBeInTheDocument();
    });

    it("renders listening dot when listening", () => {
        render(
            <ListeningIndicator
                isListening={true}
                detectedPitch={null}
            />
        );

        expect(document.querySelector(".listeningDot")).toBeInTheDocument();
    });

    it("does not render listening dot when not listening", () => {
        render(
            <ListeningIndicator
                isListening={false}
                detectedPitch={null}
            />
        );

        expect(document.querySelector(".listeningDot")).not.toBeInTheDocument();
    });

    it("renders pitch debug info when pitch is detected", () => {
        render(
            <ListeningIndicator
                isListening={true}
                detectedPitch={{ note: "La", midi: 69, frequency: 440, clarity: 0.95 }}
            />
        );

        expect(screen.getByText(/440 Hz/)).toBeInTheDocument();
        expect(screen.getByText(/95%/)).toBeInTheDocument();
    });

    it("does not render pitch debug info when no pitch detected", () => {
        render(
            <ListeningIndicator
                isListening={true}
                detectedPitch={null}
            />
        );

        expect(document.querySelector(".pitchDebug")).not.toBeInTheDocument();
    });
});
