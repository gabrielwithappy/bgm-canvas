import {
  classifyStrokes,
  inferMotif,
  measureStroke,
} from "../../../src/features/scene/model/classifyScene";
import type { Stroke } from "../../../src/shared/types/domain";

function createStroke(points: Stroke["points"]): Stroke {
  return {
    id: `stroke-${points.length}`,
    points,
    createdAt: 1,
  };
}

describe("scene classifier", () => {
  it("measures stroke bounds and direction changes", () => {
    const stroke = createStroke([
      { x: 0, y: 0 },
      { x: 20, y: 20 },
      { x: 5, y: 35 },
      { x: 25, y: 50 },
    ]);

    expect(measureStroke(stroke)).toMatchObject({
      width: 25,
      height: 50,
      pointCount: 4,
    });
  });

  it("infers tree and sea motifs from aspect ratio", () => {
    const treeStroke = createStroke([
      { x: 40, y: 180 },
      { x: 60, y: 120 },
      { x: 50, y: 40 },
    ]);
    const seaStroke = createStroke([
      { x: 20, y: 200 },
      { x: 120, y: 210 },
      { x: 220, y: 205 },
    ]);

    expect(inferMotif(treeStroke)).toBe("tree");
    expect(inferMotif(seaStroke)).toBe("sea");
  });

  it("falls back to campfire or unknown deterministically", () => {
    const campfireStroke = createStroke([
      { x: 20, y: 80 },
      { x: 50, y: 40 },
      { x: 80, y: 90 },
      { x: 45, y: 30 },
      { x: 25, y: 100 },
    ]);
    const unknownStroke = createStroke([
      { x: 10, y: 10 },
      { x: 14, y: 14 },
    ]);

    expect(inferMotif(campfireStroke)).toBe("campfire");
    expect(inferMotif(unknownStroke)).toBe("unknown");
  });

  it("classifies each stroke into a scene element", () => {
    const elements = classifyStrokes([
      createStroke([
        { x: 30, y: 180 },
        { x: 40, y: 120 },
        { x: 35, y: 20 },
      ]),
      createStroke([
        { x: 20, y: 200 },
        { x: 140, y: 202 },
        { x: 220, y: 205 },
      ]),
    ]);

    expect(elements).toHaveLength(2);
    expect(elements[0]).toMatchObject({
      motif: "tree",
      strokeIds: ["stroke-3"],
    });
    expect(elements[1].motif).toBe("sea");
    expect(elements[0].confidence).toBeGreaterThan(0.5);
  });
});
