import { renderHook } from "@testing-library/react";
import { useNoteGeneration } from "../useNoteGeneration";

it("generates a note with clef and name", () => {
    const { result } = renderHook(() => useNoteGeneration());
    const note = result.current.generateRandomNote();

    expect(note).toBeTruthy();
    expect(["treble", "bass"]).toContain(note.clef);
    expect(typeof note.name).toBe("string");
});
