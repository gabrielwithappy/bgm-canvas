import { guideTemplates } from "../../../src/features/guides/model/guideTemplates";
import { evaluateGuideMatch } from "../../../src/features/guides/model/guideMatch";
import type { Stroke } from "../../../src/shared/types/domain";

function createStroke(id: string, points: Stroke["points"]): Stroke {
  return {
    id,
    points,
    createdAt: 1,
  };
}

describe("guide match", () => {
  it("marks a sufficiently long guided stroke as matched", () => {
    const rainGuide = guideTemplates.find((guide) => guide.motif === "rain");

    expect(rainGuide).toBeDefined();

    const result = evaluateGuideMatch(
      createStroke("stroke-rain-match", [
        { x: 20, y: 160 },
        { x: 100, y: 170 },
        { x: 180, y: 180 },
        { x: 260, y: 195 },
      ]),
      rainGuide!,
    );

    expect(result).toMatchObject({
      selectedGuideId: "guide-rain",
      status: "matched",
    });
    expect(result.progress).toBeGreaterThanOrEqual(0.6);
  });

  it("marks a short guided stroke as failed", () => {
    const rainGuide = guideTemplates.find((guide) => guide.motif === "rain");

    expect(rainGuide).toBeDefined();

    const result = evaluateGuideMatch(
      createStroke("stroke-rain-failed", [
        { x: 20, y: 160 },
        { x: 55, y: 168 },
      ]),
      rainGuide!,
    );

    expect(result).toMatchObject({
      selectedGuideId: "guide-rain",
      status: "failed",
    });
    expect(result.progress).toBeLessThan(0.6);
  });
});
