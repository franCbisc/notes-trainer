import { renderHook } from "@testing-library/react";
import { useNoteGeneration } from "../useNoteGeneration";
import { TREBLE_NOTES, BASS_NOTES } from "../../constants";

describe("useNoteGeneration", () => {
    // ─── default (both) ────────────────────────────────────────────────────────

    it('generates a note with a valid clef and name when filter is "both"', () => {
        const { result } = renderHook(() => useNoteGeneration("both"));
        const note = result.current.generateRandomNote();

        expect(note).toBeTruthy();
        expect(["treble", "bass"]).toContain(note.clef);
        expect(typeof note.name).toBe("string");
    });

    it('picks treble clef when random < 0.5 (filter "both")', () => {
        const spy = jest.spyOn(Math, "random")
            .mockReturnValueOnce(0.49) // clef: treble
            .mockReturnValueOnce(0);   // index: 0

        const { result } = renderHook(() => useNoteGeneration("both"));
        const note = result.current.generateRandomNote();

        expect(note.clef).toBe("treble");
        spy.mockRestore();
    });

    it('picks bass clef when random >= 0.5 (filter "both")', () => {
        const spy = jest.spyOn(Math, "random")
            .mockReturnValueOnce(0.5) // clef: bass
            .mockReturnValueOnce(0);  // index: 0

        const { result } = renderHook(() => useNoteGeneration("both"));
        const note = result.current.generateRandomNote();

        expect(note.clef).toBe("bass");
        spy.mockRestore();
    });

    it("returns a note that belongs to the correct notes pool", () => {
        const { result } = renderHook(() => useNoteGeneration("both"));
        const note = result.current.generateRandomNote();

        const pool = note.clef === "treble" ? TREBLE_NOTES : BASS_NOTES;
        const found = pool.some((n) => n.step === note.step && n.name === note.name);
        expect(found).toBe(true);
    });

    // ─── treble-only filter ────────────────────────────────────────────────────

    it('always generates a treble note when filter is "treble"', () => {
        const { result } = renderHook(() => useNoteGeneration("treble"));

        for (let i = 0; i < 10; i++) {
            const note = result.current.generateRandomNote();
            expect(note.clef).toBe("treble");
            const found = TREBLE_NOTES.some((n) => n.step === note.step && n.name === note.name);
            expect(found).toBe(true);
        }
    });

    it('retries when treble note matches previous position (filter "treble")', () => {
        const spy = jest.spyOn(Math, "random")
            .mockReturnValueOnce(0)    // index: 0 → first treble note (same as previous)
            .mockReturnValueOnce(0.99); // index: last treble note → different

        const { result } = renderHook(() => useNoteGeneration("treble"));
        const previous = { ...TREBLE_NOTES[0], clef: "treble" as const };
        const note = result.current.generateRandomNote(previous);

        expect(note.clef).toBe("treble");
        expect(note.step).not.toBe(previous.step);
        spy.mockRestore();
    });

    // ─── bass-only filter ──────────────────────────────────────────────────────

    it('always generates a bass note when filter is "bass"', () => {
        const { result } = renderHook(() => useNoteGeneration("bass"));

        for (let i = 0; i < 10; i++) {
            const note = result.current.generateRandomNote();
            expect(note.clef).toBe("bass");
            const found = BASS_NOTES.some((n) => n.step === note.step && n.name === note.name);
            expect(found).toBe(true);
        }
    });

    it('retries when bass note matches previous position (filter "bass")', () => {
        const spy = jest.spyOn(Math, "random")
            .mockReturnValueOnce(0)    // index: 0 → first bass note (same as previous)
            .mockReturnValueOnce(0.99); // index: last bass note → different

        const { result } = renderHook(() => useNoteGeneration("bass"));
        const previous = { ...BASS_NOTES[0], clef: "bass" as const };
        const note = result.current.generateRandomNote(previous);

        expect(note.clef).toBe("bass");
        expect(note.step).not.toBe(previous.step);
        spy.mockRestore();
    });

    // ─── no previous note ──────────────────────────────────────────────────────

    it("generates a note without previousNote constraint (exits on first iteration)", () => {
        const { result } = renderHook(() => useNoteGeneration());
        const note = result.current.generateRandomNote(undefined);
        expect(note).toBeTruthy();
        expect(["treble", "bass"]).toContain(note.clef);
    });

    // ─── retry in "both" mode ──────────────────────────────────────────────────

    it('retries in "both" mode when generated note matches previous position', () => {
        const spy = jest.spyOn(Math, "random")
            .mockReturnValueOnce(0)    // clef: treble
            .mockReturnValueOnce(0)    // index: 0 → same as previous
            .mockReturnValueOnce(0)    // clef: treble (retry)
            .mockReturnValueOnce(0.99); // index: last treble note → different

        const { result } = renderHook(() => useNoteGeneration("both"));
        const previous = { ...TREBLE_NOTES[0], clef: "treble" as const };
        const note = result.current.generateRandomNote(previous);

        expect(note.step).not.toBe(previous.step);
        spy.mockRestore();
    });
});

