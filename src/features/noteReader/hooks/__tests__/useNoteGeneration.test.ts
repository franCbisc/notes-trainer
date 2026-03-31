import { renderHook } from "@testing-library/react";
import { useNoteGeneration, applyKeySignature } from "../useNoteGeneration";
import { TREBLE_NOTES, BASS_NOTES } from "../../constants";
import type { Note } from "../../types";

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

// ─── key signature ────────────────────────────────────────────────────────────

describe("useNoteGeneration – key signature", () => {
    it("returns the base note name when it is not in the key signature", () => {
        // index 0 in TREBLE_NOTES is La — not in a Fa# key
        // treble filter skips the clef coin-flip, so only one random call (for index)
        const spy = jest.spyOn(Math, "random")
            .mockReturnValueOnce(0);    // index 0 → La

        const keyAccidentals = [{ baseName: "Fa", accidental: "#" as const, trebleStep: 4, bassStep: 2 }];
        const { result } = renderHook(() => useNoteGeneration("treble", keyAccidentals));
        const note = result.current.generateRandomNote();

        expect(note.name).toBe("La");
        spy.mockRestore();
    });

    it("appends # to the note name when the note is in the key signature", () => {
        // Find the index of the first Fa in TREBLE_NOTES
        const trebleNotes = TREBLE_NOTES as readonly { step: number; name: string }[];
        const faIndex = trebleNotes.findIndex((n) => n.name === "Fa");
        // Math.floor(random * length) === faIndex  →  random = faIndex / length
        const spy = jest.spyOn(Math, "random")
            .mockReturnValueOnce(faIndex / trebleNotes.length);

        const keyAccidentals = [{ baseName: "Fa", accidental: "#" as const, trebleStep: 4, bassStep: 2 }];
        const { result } = renderHook(() => useNoteGeneration("treble", keyAccidentals));
        const note = result.current.generateRandomNote();

        expect(note.name).toBe("Fa#");
        spy.mockRestore();
    });

    it("appends b to the note name when the note is in a flat key signature", () => {
        const trebleNotes = TREBLE_NOTES as readonly { step: number; name: string }[];
        const siIndex = trebleNotes.findIndex((n) => n.name === "Si");
        const spy = jest.spyOn(Math, "random")
            .mockReturnValueOnce(siIndex / trebleNotes.length);

        const keyAccidentals = [{ baseName: "Si", accidental: "b" as const, trebleStep: 0, bassStep: -2 }];
        const { result } = renderHook(() => useNoteGeneration("treble", keyAccidentals));
        const note = result.current.generateRandomNote();

        expect(note.name).toBe("Sib");
        spy.mockRestore();
    });

    it("strips a trailing accidental from note.name before matching baseName", () => {
        // Simulate a note that already carries '#' (e.g. reprocessed after a key change).
        // applyKeySignature must strip the '#' first, then match and re-apply correctly.
        const trebleNotes = TREBLE_NOTES as readonly { step: number; name: string; midi: number }[];
        const faIndex = trebleNotes.findIndex((n) => n.name === "Fa");
        const spy = jest.spyOn(Math, "random")
            .mockReturnValueOnce(faIndex / trebleNotes.length);

        // Flat key after sharp: the pool still returns "Fa", but we want "Fab" not "Fa##"
        const keyAccidentals = [{ baseName: "Fa", accidental: "b" as const, trebleStep: 4, bassStep: 2 }];
        const { result } = renderHook(() => useNoteGeneration("treble", keyAccidentals));
        const note = result.current.generateRandomNote();

        expect(note.name).toBe("Fab");
        spy.mockRestore();
    });

    it("shifts midi by +1 when applying a sharp accidental", () => {
        const trebleNotes = TREBLE_NOTES as readonly { step: number; name: string; midi: number }[];
        const faIndex = trebleNotes.findIndex((n) => n.name === "Fa");
        const baseMidi = trebleNotes[faIndex].midi; // Fa4 = 65
        const spy = jest.spyOn(Math, "random")
            .mockReturnValueOnce(faIndex / trebleNotes.length);

        const keyAccidentals = [{ baseName: "Fa", accidental: "#" as const, trebleStep: 4, bassStep: 2 }];
        const { result } = renderHook(() => useNoteGeneration("treble", keyAccidentals));
        const note = result.current.generateRandomNote();

        expect(note.name).toBe("Fa#");
        expect(note.midi).toBe(baseMidi + 1); // Fa#4 = 66
        spy.mockRestore();
    });

    it("shifts midi by -1 when applying a flat accidental", () => {
        const trebleNotes = TREBLE_NOTES as readonly { step: number; name: string; midi: number }[];
        const siIndex = trebleNotes.findIndex((n) => n.name === "Si");
        const baseMidi = trebleNotes[siIndex].midi; // Si4 = 71
        const spy = jest.spyOn(Math, "random")
            .mockReturnValueOnce(siIndex / trebleNotes.length);

        const keyAccidentals = [{ baseName: "Si", accidental: "b" as const, trebleStep: 0, bassStep: -2 }];
        const { result } = renderHook(() => useNoteGeneration("treble", keyAccidentals));
        const note = result.current.generateRandomNote();

        expect(note.name).toBe("Sib");
        expect(note.midi).toBe(baseMidi - 1); // Sib4 = 70
        spy.mockRestore();
    });

    it("generated note always has a midi field", () => {
        const { result } = renderHook(() => useNoteGeneration("both"));
        const note = result.current.generateRandomNote();
        expect(typeof note.midi).toBe("number");
        expect(note.midi).toBeGreaterThanOrEqual(0);
    });

    it("does not modify note name when keyAccidentals don't match any note", () => {
        const trebleNotes = TREBLE_NOTES as readonly { step: number; name: string }[];
        const doIndex = trebleNotes.findIndex((n) => n.name === "Do");
        const spy = jest.spyOn(Math, "random")
            .mockReturnValueOnce(doIndex / trebleNotes.length);

        const keyAccidentals = [{ baseName: "Fa", accidental: "#" as const, trebleStep: 4, bassStep: 2 }];
        const { result } = renderHook(() => useNoteGeneration("treble", keyAccidentals));
        const note = result.current.generateRandomNote();

        expect(note.name).toBe("Do");
        expect(note.midi).toBe(60);
        spy.mockRestore();
    });
});

describe("applyKeySignature", () => {
    it("returns note as-is when midi is undefined", () => {
        const note: Note = { step: 0, name: "Do", clef: "treble", midi: undefined };
        const keyAccidentals = [{ baseName: "Fa", accidental: "#" as const, trebleStep: 4, bassStep: 2 }];

        const result = applyKeySignature(note, keyAccidentals);

        expect(result.name).toBe("Do");
        expect(result.midi).toBeUndefined();
    });
});

