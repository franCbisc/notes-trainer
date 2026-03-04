import { renderHook } from "@testing-library/react";
import { useNoteGeneration } from "../useNoteGeneration";
import { TREBLE_NOTES, BASS_NOTES } from "../../constants";

describe("useNoteGeneration", () => {
    it("generates a note with a valid clef and name", () => {
        const { result } = renderHook(() => useNoteGeneration());
        const note = result.current.generateRandomNote();

        expect(note).toBeTruthy();
        expect(["treble", "bass"]).toContain(note.clef);
        expect(typeof note.name).toBe("string");
    });

    it("returns a note that belongs to the correct notes pool", () => {
        const { result } = renderHook(() => useNoteGeneration());
        const note = result.current.generateRandomNote();

        const pool = note.clef === "treble" ? TREBLE_NOTES : BASS_NOTES;
        const found = pool.some((n) => n.step === note.step && n.name === note.name);
        expect(found).toBe(true);
    });

    it("generates a different position when previousNote is provided", () => {
        // Force Math.random to always return 0 so we get the first treble note
        const spy = jest.spyOn(Math, "random");

        // First call picks clef (0 → treble), second picks index (0 → first note)
        // Then the do-while detects same position and retries:
        // third call picks clef (0 → treble), fourth picks a different index (0.9 → last note)
        spy
            .mockReturnValueOnce(0)    // clef: treble
            .mockReturnValueOnce(0)    // index: 0 (first treble note) → same as previous
            .mockReturnValueOnce(0)    // clef: treble (retry)
            .mockReturnValueOnce(0.99); // index: last treble note → different position

        const { result } = renderHook(() => useNoteGeneration());
        const firstNote = TREBLE_NOTES[0];
        const previous = { ...firstNote, clef: "treble" as const };

        const note = result.current.generateRandomNote(previous);

        expect(note.step).not.toBe(previous.step);

        spy.mockRestore();
    });

    it("generates a note without previousNote constraint", () => {
        const { result } = renderHook(() => useNoteGeneration());
        // Called without previousNote — do-while exits on first iteration
        const note = result.current.generateRandomNote(undefined);
        expect(note).toBeTruthy();
        expect(["treble", "bass"]).toContain(note.clef);
    });
});

