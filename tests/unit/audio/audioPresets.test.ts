import { describe, it, expect } from "vitest";
import { resolveAudioPreset } from "../../../src/features/audio/model/audioPresets";

describe("audioPresets", () => {
  it("maps 'rain' to white noise with a bandpass filter", () => {
    const preset = resolveAudioPreset("rain");
    expect(preset.noiseType).toBe("white");
    expect(preset.filter?.type).toBe("bandpass");
    expect(preset.gainMultiplier).toBeGreaterThan(0);
  });

  it("maps 'sea' to brown noise with a lowpass filter", () => {
    const preset = resolveAudioPreset("sea");
    expect(preset.noiseType).toBe("brown");
    expect(preset.filter?.type).toBe("lowpass");
  });

  it("maps 'campfire' to brown noise", () => {
    const preset = resolveAudioPreset("campfire");
    expect(preset.noiseType).toBe("brown");
    expect(preset.gainMultiplier).toBeGreaterThan(0);
  });

  it("maps 'wind' to pink noise with a lowpass filter", () => {
    const preset = resolveAudioPreset("wind");
    expect(preset.noiseType).toBe("pink");
    expect(preset.filter?.type).toBe("lowpass");
  });

  it("provides a fallback default preset for 'unknown'", () => {
    const preset = resolveAudioPreset("unknown");
    expect(preset.noiseType).toBe("pink");
    expect(preset.gainMultiplier).toBeGreaterThan(0);
  });
});
