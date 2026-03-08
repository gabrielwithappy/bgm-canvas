import type {
  GuideTemplate,
  SceneElement,
  Stroke,
} from "../../../shared/types/domain";

export function toGuidedSceneElement(
  stroke: Stroke,
  guide: GuideTemplate,
): SceneElement {
  return {
    id: `scene-${stroke.id}`,
    strokeIds: [stroke.id],
    motif: guide.motif,
    confidence: 0.9,
  };
}
