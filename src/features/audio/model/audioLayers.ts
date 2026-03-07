import type { AudioLayer, SceneElement } from "../../../shared/types/domain";

export type AudioSessionState = "idle" | "playing" | "paused";

function layerStateFromSession(
  sessionState: AudioSessionState,
): AudioLayer["state"] {
  switch (sessionState) {
    case "playing":
      return "playing";
    case "paused":
      return "stopped";
    default:
      return "idle";
  }
}

export function deriveAudioLayers(
  sceneElements: SceneElement[],
  sessionState: AudioSessionState,
): AudioLayer[] {
  return sceneElements.map((element) => ({
    elementId: element.id,
    motif: element.motif,
    state: layerStateFromSession(sessionState),
  }));
}
