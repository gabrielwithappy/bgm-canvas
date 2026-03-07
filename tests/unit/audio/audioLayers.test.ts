import { deriveAudioLayers } from "../../../src/features/audio/model/audioLayers";
import type { SceneElement } from "../../../src/shared/types/domain";

const sceneElements: SceneElement[] = [
  {
    id: "scene-1",
    strokeIds: ["stroke-1"],
    motif: "tree",
    confidence: 0.81,
  },
  {
    id: "scene-2",
    strokeIds: ["stroke-2"],
    motif: "sea",
    confidence: 0.77,
  },
];

describe("audio layer derivation", () => {
  it("maps scene elements into playing layers", () => {
    expect(deriveAudioLayers(sceneElements, "playing")).toEqual([
      { elementId: "scene-1", motif: "tree", state: "playing" },
      { elementId: "scene-2", motif: "sea", state: "playing" },
    ]);
  });

  it("maps paused session to stopped layers", () => {
    expect(deriveAudioLayers(sceneElements, "paused")[0].state).toBe("stopped");
  });

  it("keeps idle sessions idle", () => {
    expect(deriveAudioLayers(sceneElements, "idle")[1].state).toBe("idle");
  });
});
