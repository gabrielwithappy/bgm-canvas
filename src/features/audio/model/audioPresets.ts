import type { Motif } from "../../../shared/types/domain";

export type NoiseType = "white" | "pink" | "brown";

export type AudioPreset = {
  noiseType: NoiseType;
  filter?: {
    type: BiquadFilterType;
    frequency: number;
    Q?: number;
  };
  gainMultiplier: number;
};

export function resolveAudioPreset(motif: Motif): AudioPreset {
  switch (motif) {
    case "rain":
      return {
        noiseType: "white",
        filter: { type: "bandpass", frequency: 1200, Q: 0.8 },
        gainMultiplier: 1.0,
      };
    case "wind":
      return {
        noiseType: "pink",
        filter: { type: "lowpass", frequency: 800 },
        gainMultiplier: 0.8,
      };
    case "sea":
      return {
        noiseType: "brown",
        filter: { type: "lowpass", frequency: 600 },
        gainMultiplier: 1.1,
      };
    case "campfire":
      return {
        noiseType: "brown",
        filter: { type: "bandpass", frequency: 300, Q: 0.5 },
        gainMultiplier: 0.9,
      };
    case "tree":
      return {
        noiseType: "pink",
        filter: { type: "bandpass", frequency: 500, Q: 1.2 },
        gainMultiplier: 0.6,
      };
    case "star":
      return {
        noiseType: "white",
        filter: { type: "highpass", frequency: 4000 },
        gainMultiplier: 0.3,
      };
    case "window":
      return {
        noiseType: "pink",
        filter: { type: "lowpass", frequency: 400 },
        gainMultiplier: 0.5,
      };
    case "lamp":
      return {
        noiseType: "brown",
        filter: { type: "lowpass", frequency: 200 },
        gainMultiplier: 0.35,
      };
    case "desk":
      return {
        noiseType: "brown",
        filter: { type: "lowpass", frequency: 300 },
        gainMultiplier: 0.4,
      };
    case "unknown":
    default:
      return {
        noiseType: "pink",
        gainMultiplier: 0.3,
      };
  }
}
