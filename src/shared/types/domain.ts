export type Point = {
  x: number;
  y: number;
};

export type Stroke = {
  id: string;
  points: Point[];
  createdAt: number;
};

export type Motif =
  | "campfire"
  | "rain"
  | "wind"
  | "tree"
  | "star"
  | "sea"
  | "window"
  | "lamp"
  | "desk"
  | "unknown";

export type GuideTemplate = {
  id: string;
  motif: Motif;
  label: string;
  previewPath: Point[];
};

export type SceneElement = {
  id: string;
  strokeIds: string[];
  motif: Motif;
  confidence: number;
};

export type AudioLayerState = "idle" | "loading" | "playing" | "stopped";

export type AudioLayer = {
  elementId: string;
  motif: Motif;
  state: AudioLayerState;
};
