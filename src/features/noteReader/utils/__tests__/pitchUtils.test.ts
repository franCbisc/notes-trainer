import { frequencyToMidi, midiToNoteName, frequencyToNoteName, frequencyToNoteWithMidi, isPianoFrequency, PIANO_FREQ_MIN, PIANO_FREQ_MAX, midiToNoteNameWithOctave } from "../pitchUtils";

describe("frequencyToMidi", () => {
    it("returns -1 for zero frequency", () => {
        expect(frequencyToMidi(0)).toBe(-1);
    });

    it("returns -1 for negative frequency", () => {
        expect(frequencyToMidi(-100)).toBe(-1);
    });

    it("maps A4 (440 Hz) to MIDI 69", () => {
        expect(frequencyToMidi(440)).toBe(69);
    });

    it("maps A3 (220 Hz) to MIDI 57", () => {
        expect(frequencyToMidi(220)).toBe(57);
    });

    it("maps A5 (880 Hz) to MIDI 81", () => {
        expect(frequencyToMidi(880)).toBe(81);
    });

    it("maps C4 (middle C, ~261.63 Hz) to MIDI 60", () => {
        expect(frequencyToMidi(261.63)).toBe(60);
    });

    it("maps C#4 (~277.18 Hz) to MIDI 61", () => {
        expect(frequencyToMidi(277.18)).toBe(61);
    });

    it("maps B4 (~493.88 Hz) to MIDI 71", () => {
        expect(frequencyToMidi(493.88)).toBe(71);
    });

    it("rounds to the nearest semitone", () => {
        // A4 is 440 Hz; a frequency slightly above should still map to 69
        expect(frequencyToMidi(442)).toBe(69);
        // A4 + one semitone = A#4 / Bb4 = ~466.16 Hz
        expect(frequencyToMidi(466.16)).toBe(70);
    });
});

describe("midiToNoteName", () => {
    it("returns null for MIDI < 0", () => {
        expect(midiToNoteName(-1)).toBeNull();
    });

    it("returns null for MIDI > 127", () => {
        expect(midiToNoteName(128)).toBeNull();
    });

    it("maps MIDI 60 (C4) to 'Do'", () => {
        expect(midiToNoteName(60)).toBe("Do");
    });

    it("maps MIDI 61 (C#4) to 'Do#'", () => {
        expect(midiToNoteName(61)).toBe("Do#");
    });

    it("maps MIDI 62 (D4) to 'Re'", () => {
        expect(midiToNoteName(62)).toBe("Re");
    });

    it("maps MIDI 63 (D#4) to 'Re#'", () => {
        expect(midiToNoteName(63)).toBe("Re#");
    });

    it("maps MIDI 64 (E4) to 'Mi'", () => {
        expect(midiToNoteName(64)).toBe("Mi");
    });

    it("maps MIDI 65 (F4) to 'Fa'", () => {
        expect(midiToNoteName(65)).toBe("Fa");
    });

    it("maps MIDI 66 (F#4) to 'Fa#'", () => {
        expect(midiToNoteName(66)).toBe("Fa#");
    });

    it("maps MIDI 67 (G4) to 'Sol'", () => {
        expect(midiToNoteName(67)).toBe("Sol");
    });

    it("maps MIDI 68 (G#4) to 'Sol#'", () => {
        expect(midiToNoteName(68)).toBe("Sol#");
    });

    it("maps MIDI 69 (A4) to 'La'", () => {
        expect(midiToNoteName(69)).toBe("La");
    });

    it("maps MIDI 70 (A#4) to 'La#'", () => {
        expect(midiToNoteName(70)).toBe("La#");
    });

    it("maps MIDI 71 (B4) to 'Si'", () => {
        expect(midiToNoteName(71)).toBe("Si");
    });

    it("wraps correctly across octaves: MIDI 72 (C5) → 'Do'", () => {
        expect(midiToNoteName(72)).toBe("Do");
    });

    it("handles the lowest note: MIDI 0 (C-1) → 'Do'", () => {
        expect(midiToNoteName(0)).toBe("Do");
    });

    it("handles the highest note: MIDI 127 (G9) → 'Sol'", () => {
        expect(midiToNoteName(127)).toBe("Sol");
    });
});

describe("frequencyToNoteName", () => {
    it("returns null for zero frequency", () => {
        expect(frequencyToNoteName(0)).toBeNull();
    });

    it("returns null for negative frequency", () => {
        expect(frequencyToNoteName(-1)).toBeNull();
    });

    it("maps 440 Hz to 'La' (A4)", () => {
        expect(frequencyToNoteName(440)).toBe("La");
    });

    it("maps middle C (~261.63 Hz) to 'Do'", () => {
        expect(frequencyToNoteName(261.63)).toBe("Do");
    });

    it("maps C# (~277.18 Hz) to 'Do#'", () => {
        expect(frequencyToNoteName(277.18)).toBe("Do#");
    });

    it("maps E4 (~329.63 Hz) to 'Mi'", () => {
        expect(frequencyToNoteName(329.63)).toBe("Mi");
    });

    it("maps G4 (~392 Hz) to 'Sol'", () => {
        expect(frequencyToNoteName(392)).toBe("Sol");
    });

    it("maps B4 (~493.88 Hz) to 'Si'", () => {
        expect(frequencyToNoteName(493.88)).toBe("Si");
    });
});

describe("frequencyToNoteWithMidi", () => {
    it("returns null for zero frequency", () => {
        expect(frequencyToNoteWithMidi(0)).toBeNull();
    });

    it("returns null for negative frequency", () => {
        expect(frequencyToNoteWithMidi(-1)).toBeNull();
    });

    it("maps A4 (440 Hz) to { name: 'La', midi: 69 }", () => {
        expect(frequencyToNoteWithMidi(440)).toEqual({ name: "La", midi: 69 });
    });

    it("maps middle C (~261.63 Hz) to { name: 'Do', midi: 60 }", () => {
        expect(frequencyToNoteWithMidi(261.63)).toEqual({ name: "Do", midi: 60 });
    });

    it("maps B4 (~493.88 Hz) to { name: 'Si', midi: 71 }", () => {
        expect(frequencyToNoteWithMidi(493.88)).toEqual({ name: "Si", midi: 71 });
    });

    it("maps C5 (~523.25 Hz) to { name: 'Do', midi: 72 }", () => {
        expect(frequencyToNoteWithMidi(523.25)).toEqual({ name: "Do", midi: 72 });
    });
});

describe("midiToNoteNameWithOctave", () => {
    it("returns null for MIDI < 0", () => {
        expect(midiToNoteNameWithOctave(-1)).toBeNull();
    });

    it("returns null for MIDI > 127", () => {
        expect(midiToNoteNameWithOctave(128)).toBeNull();
    });

    it("maps MIDI 60 (C4) to 'Do4'", () => {
        expect(midiToNoteNameWithOctave(60)).toBe("Do4");
    });

    it("maps MIDI 69 (A4) to 'La4'", () => {
        expect(midiToNoteNameWithOctave(69)).toBe("La4");
    });

    it("maps MIDI 72 (C5) to 'Do5'", () => {
        expect(midiToNoteNameWithOctave(72)).toBe("Do5");
    });

    it("maps MIDI 0 (C-1) to 'Do-1'", () => {
        expect(midiToNoteNameWithOctave(0)).toBe("Do-1");
    });

    it("maps MIDI 127 (G9) to 'Sol9'", () => {
        expect(midiToNoteNameWithOctave(127)).toBe("Sol9");
    });

    it("maps MIDI 61 (C#4) to 'Do#4'", () => {
        expect(midiToNoteNameWithOctave(61)).toBe("Do#4");
    });
});

describe("isPianoFrequency", () => {
    it("returns true for A0 — the lowest piano key (27.5 Hz)", () => {
        expect(isPianoFrequency(PIANO_FREQ_MIN)).toBe(true);
    });

    it("returns true for C8 — the highest piano key (4186 Hz)", () => {
        expect(isPianoFrequency(PIANO_FREQ_MAX)).toBe(true);
    });

    it("returns true for a frequency well within the piano range", () => {
        expect(isPianoFrequency(440)).toBe(true); // A4
    });

    it("returns false for a frequency below the piano range", () => {
        expect(isPianoFrequency(20)).toBe(false);
    });

    it("returns false for a frequency above the piano range", () => {
        expect(isPianoFrequency(5000)).toBe(false);
    });

    it("returns false for zero", () => {
        expect(isPianoFrequency(0)).toBe(false);
    });

    it("returns false for negative values", () => {
        expect(isPianoFrequency(-100)).toBe(false);
    });
});

