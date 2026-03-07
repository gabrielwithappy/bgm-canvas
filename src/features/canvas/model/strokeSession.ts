import type { Stroke } from "../../../shared/types/domain";

export type StrokeSessionAction =
  | { type: "add"; stroke: Stroke }
  | { type: "undo" }
  | { type: "reset" };

export function strokeSessionReducer(
  state: Stroke[],
  action: StrokeSessionAction,
): Stroke[] {
  switch (action.type) {
    case "add":
      return [...state, action.stroke];
    case "undo":
      return state.slice(0, -1);
    case "reset":
      return [];
    default:
      return state;
  }
}
