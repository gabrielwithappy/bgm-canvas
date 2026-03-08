import type {
  GuideTemplate,
  GuidedInputState,
  Stroke,
} from "../../../shared/types/domain";

const GUIDE_MATCH_THRESHOLD = 0.6;

export function calculateGuideProgress(stroke: Stroke, guide: GuideTemplate) {
  if (guide.previewPath.length === 0) {
    return 0;
  }

  const progress = stroke.points.length / guide.previewPath.length;

  return Number(Math.min(1, progress).toFixed(2));
}

export function evaluateGuideMatch(
  stroke: Stroke,
  guide: GuideTemplate,
): GuidedInputState {
  const progress = calculateGuideProgress(stroke, guide);

  return {
    selectedGuideId: guide.id,
    status: progress >= GUIDE_MATCH_THRESHOLD ? "matched" : "failed",
    progress,
  };
}
