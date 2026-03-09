import type { Motif } from "../../../shared/types/domain";

export type AudioPreset = {
    oscillatorType: OscillatorType;
    frequency: number;
    filter?: {
        type: BiquadFilterType;
        frequency: number;
    };
};

export function resolveAudioPreset(motif: Motif): AudioPreset {
    switch (motif) {
        case "sea":
            return {
                oscillatorType: "sine",
                frequency: 150,
                filter: { type: "lowpass", frequency: 400 },
            };
        case "campfire":
            return {
                oscillatorType: "triangle",
                frequency: 100,
                filter: { type: "lowpass", frequency: 800 },
            };
        case "rain":
            return {
                oscillatorType: "sine",
                frequency: 400,
                filter: { type: "highpass", frequency: 300 },
            };
        case "wind":
            return {
                oscillatorType: "sine",
                frequency: 200,
                filter: { type: "lowpass", frequency: 600 },
            };
        case "tree":
            return {
                oscillatorType: "triangle",
                frequency: 196,
            };
        case "star":
            return {
                oscillatorType: "sine",
                frequency: 523,
            };
        case "window":
            return {
                oscillatorType: "sine",
                frequency: 240,
                filter: { type: "lowpass", frequency: 500 },
            };
        case "lamp":
            return {
                oscillatorType: "triangle",
                frequency: 330,
                filter: { type: "lowpass", frequency: 600 },
            };
        case "desk":
            return {
                oscillatorType: "triangle",
                frequency: 120,
                filter: { type: "lowpass", frequency: 300 },
            };
        case "unknown":
        default:
            return {
                oscillatorType: "triangle",
                frequency: 246,
            };
    }
}
