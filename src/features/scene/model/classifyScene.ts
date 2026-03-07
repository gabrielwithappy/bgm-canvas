import type { Point, SceneElement, Stroke } from "../../../shared/types/domain";

type StrokeMetrics = {
  width: number;
  height: number;
  pointCount: number;
  directionChanges: number;
};

function getBounds(points: Point[]) {
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);

  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  };
}

export function measureStroke(stroke: Stroke): StrokeMetrics {
  if (stroke.points.length === 0) {
    return {
      width: 0,
      height: 0,
      pointCount: 0,
      directionChanges: 0,
    };
  }

  const bounds = getBounds(stroke.points);
  let directionChanges = 0;

  for (let index = 2; index < stroke.points.length; index += 1) {
    const previousVector = {
      x: stroke.points[index - 1].x - stroke.points[index - 2].x,
      y: stroke.points[index - 1].y - stroke.points[index - 2].y,
    };
    const currentVector = {
      x: stroke.points[index].x - stroke.points[index - 1].x,
      y: stroke.points[index].y - stroke.points[index - 1].y,
    };

    const dotProduct =
      previousVector.x * currentVector.x + previousVector.y * currentVector.y;

    if (dotProduct < 0) {
      directionChanges += 1;
    }
  }

  return {
    width: bounds.maxX - bounds.minX,
    height: bounds.maxY - bounds.minY,
    pointCount: stroke.points.length,
    directionChanges,
  };
}

export function inferMotif(stroke: Stroke): SceneElement["motif"] {
  const metrics = measureStroke(stroke);

  if (metrics.pointCount < 2 || (metrics.width < 12 && metrics.height < 12)) {
    return "unknown";
  }

  if (metrics.height > metrics.width * 1.4) {
    return "tree";
  }

  if (metrics.width > metrics.height * 2.4) {
    return "sea";
  }

  if (
    metrics.directionChanges >= 2 &&
    metrics.height > 20 &&
    metrics.width > 20
  ) {
    return "campfire";
  }

  return "unknown";
}

function confidenceFromMotif(
  motif: SceneElement["motif"],
  metrics: StrokeMetrics,
): number {
  switch (motif) {
    case "tree":
      return Math.min(0.96, 0.55 + metrics.height / Math.max(metrics.width, 1) / 3);
    case "sea":
      return Math.min(0.92, 0.52 + metrics.width / Math.max(metrics.height, 1) / 5);
    case "campfire":
      return Math.min(0.9, 0.5 + metrics.directionChanges * 0.12);
    default:
      return 0.4;
  }
}

export function classifyStrokes(strokes: Stroke[]): SceneElement[] {
  return strokes.map((stroke) => {
    const metrics = measureStroke(stroke);
    const motif = inferMotif(stroke);

    return {
      id: `scene-${stroke.id}`,
      strokeIds: [stroke.id],
      motif,
      confidence: Number(confidenceFromMotif(motif, metrics).toFixed(2)),
    };
  });
}
