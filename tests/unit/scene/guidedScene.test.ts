import { guideTemplates } from "../../../src/features/guides/model/guideTemplates";
import { toGuidedSceneElement } from "../../../src/features/scene/model/guidedScene";
import type { Stroke } from "../../../src/shared/types/domain";

function createStroke(points: Stroke["points"]): Stroke {
  return {
    id: "stroke-guided",
    points,
    createdAt: 1,
  };
}

describe("guided scene mapping", () => {
  it("maps a completed stroke to the selected guide motif", () => {
    const stroke = createStroke([
      { x: 10, y: 10 },
      { x: 220, y: 20 },
      { x: 440, y: 30 },
    ]);

    const rainGuide = guideTemplates.find((guide) => guide.motif === "rain");

    expect(rainGuide).toBeDefined();
    expect(toGuidedSceneElement(stroke, rainGuide!)).toMatchObject({
      id: "scene-stroke-guided",
      strokeIds: ["stroke-guided"],
      motif: "rain",
      confidence: 0.9,
    });
  });
});
