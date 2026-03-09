import { describe, it, expect } from "vitest";
import { resolveAudioPreset } from "../../../src/features/audio/model/audioPresets";

describe("audioPresets", () => {
    it("maps 'sea' to a sine wave with a lowpass filter", () => {
        const preset = resolveAudioPreset("sea");
        expect(preset.oscillatorType).toBe("sine");
        expect(preset.frequency).toBe(150);
        expect(preset.filter).toEqual({ type: "lowpass", frequency: 400 });
    });

    it("maps 'campfire' to a triangle wave with a bandpass filter to simulate crackle warmth", () => {
        const preset = resolveAudioPreset("campfire");
        expect(preset.oscillatorType).toBe("triangle");
        expect(preset.frequency).toBe(100);
        expect(preset.filter).toEqual({ type: "lowpass", frequency: 800 });
    });

    it("maps 'rain' to a high-frequency sine/triangle with a lowpass filter to mimic soft droplets", () => {
        const preset = resolveAudioPreset("rain");
        expect(preset.oscillatorType).toBe("sine");
        expect(preset.frequency).toBe(400);
        expect(preset.filter).toEqual({ type: "highpass", frequency: 300 });
    });

    it("maps 'wind' to a low-frequency sine wave with lowpass filter", () => {
        const preset = resolveAudioPreset("wind");
        expect(preset.oscillatorType).toBe("sine");
        expect(preset.frequency).toBe(200);
        expect(preset.filter).toEqual({ type: "lowpass", frequency: 600 });
    });

    it("provides a fallback default preset for 'unknown'", () => {
        const preset = resolveAudioPreset("unknown");
        expect(preset.oscillatorType).toBe("triangle");
        expect(preset.frequency).toBe(246);
        expect(preset.filter).toEqual(undefined);
    });
});
