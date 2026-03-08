import { useMemo, useReducer, useState } from "react";
import { useAudioSession } from "../features/audio/hooks/useAudioSession";
import { deriveAudioLayers } from "../features/audio/model/audioLayers";
import { CanvasSurface } from "../features/canvas/CanvasSurface";
import { evaluateGuideMatch } from "../features/guides/model/guideMatch";
import { guideTemplates } from "../features/guides/model/guideTemplates";
import { strokeSessionReducer } from "../features/canvas/model/strokeSession";
import { classifyStrokes } from "../features/scene/model/classifyScene";
import { toGuidedSceneElement } from "../features/scene/model/guidedScene";
import type {
  GuideTemplate,
  GuidedInputState,
  SceneElement,
  Stroke,
} from "../shared/types/domain";
import "./App.css";

type GuidedAttempt = {
  guide: GuideTemplate;
  match: GuidedInputState;
};

export function App() {
  const [strokes, dispatch] = useReducer(strokeSessionReducer, [] as Stroke[]);
  const [guidedAttempts, setGuidedAttempts] = useState<
    Record<string, GuidedAttempt>
  >({});
  const [selectedGuideId, setSelectedGuideId] = useState<string>("");
  const sceneElements = useMemo(
    () =>
      strokes.flatMap((stroke) => {
        const guidedAttempt = guidedAttempts[stroke.id];

        if (guidedAttempt) {
          if (guidedAttempt.match.status === "matched") {
            return [toGuidedSceneElement(stroke, guidedAttempt.guide)];
          }

          return [];
        }

        return [classifyStrokes([stroke])[0]];
      }),
    [guidedAttempts, strokes],
  );
  const { pause, replay, reset: resetAudio, sessionState } =
    useAudioSession(sceneElements);
  const audioLayers = deriveAudioLayers(sceneElements, sessionState);
  const visibleMotifs = sceneElements.slice(-3);
  const selectedGuide = useMemo(
    () =>
      guideTemplates.find((guide) => guide.id === selectedGuideId) ?? null,
    [selectedGuideId],
  );
  const latestGuidedInput = useMemo(() => {
    for (let index = strokes.length - 1; index >= 0; index -= 1) {
      const guidedAttempt = guidedAttempts[strokes[index].id];

      if (guidedAttempt) {
        return guidedAttempt.match;
      }
    }

    return {
      selectedGuideId: selectedGuide?.id ?? null,
      status: "idle",
      progress: 0,
    } satisfies GuidedInputState;
  }, [guidedAttempts, selectedGuide?.id, strokes]);

  const resetSession = async () => {
    dispatch({ type: "reset" });
    setGuidedAttempts({});
    await resetAudio();
  };

  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">BGM Canvas MVP</p>
        <h1>Sketch a scene, then let the soundscape grow with it.</h1>
        <p className="hero__body">
          The first implementation slice fixes the shared contracts, empty
          canvas shell, and automated smoke coverage before drawing and audio
          logic land in smaller follow-up tasks.
        </p>
      </section>

      <section className="workspace" aria-label="BGM Canvas workspace">
        <CanvasSurface
          onStrokeComplete={(stroke) => {
            dispatch({ type: "add", stroke });
            if (selectedGuide) {
              setGuidedAttempts((currentAttempts) => ({
                ...currentAttempts,
                [stroke.id]: {
                  guide: selectedGuide,
                  match: evaluateGuideMatch(stroke, selectedGuide),
                },
              }));
            }
          }}
          selectedGuide={selectedGuide}
          strokes={strokes}
        />

        <aside className="status-panel" aria-label="Session status">
          <div className="status-card">
            <p className="eyebrow">Guided input</p>
            <h2>Choose a motif guide</h2>
            <div className="guide-palette" role="group" aria-label="Motif guides">
              {guideTemplates.map((guide: GuideTemplate) => {
                const isSelected = guide.id === selectedGuide?.id;

                return (
                  <button
                    aria-pressed={isSelected}
                    className={isSelected ? "guide-chip guide-chip--selected" : "guide-chip"}
                    key={guide.id}
                    onClick={() => {
                      setSelectedGuideId(guide.id);
                    }}
                    type="button"
                  >
                    {guide.label} guide
                  </button>
                );
              })}
            </div>
          </div>

          <div className="status-card">
            <p className="eyebrow">Drawing status</p>
            <h2>Canvas snapshot</h2>
            <dl>
              <div>
                <dt>Selected guide</dt>
                <dd data-testid="selected-guide">
                  {selectedGuide ? selectedGuide.label : "None"}
                </dd>
              </div>
              <div>
                <dt>Strokes</dt>
                <dd data-testid="stroke-count">{strokes.length}</dd>
              </div>
              <div>
                <dt>Brush</dt>
                <dd>Single black line active</dd>
              </div>
              <div>
                <dt>Scene elements</dt>
                <dd data-testid="scene-count">{sceneElements.length}</dd>
              </div>
              <div>
                <dt>Audio layers</dt>
                <dd data-testid="audio-layer-count">{audioLayers.length}</dd>
              </div>
              <div>
                <dt>Audio state</dt>
                <dd data-testid="audio-state">{sessionState}</dd>
              </div>
              <div>
                <dt>Guide match</dt>
                <dd data-testid="guided-match-state">{latestGuidedInput.status}</dd>
              </div>
              <div>
                <dt>Match progress</dt>
                <dd data-testid="guided-match-progress">
                  {Math.round(latestGuidedInput.progress * 100)}%
                </dd>
              </div>
            </dl>

            <div className="scene-badges" aria-label="Detected motifs">
              {visibleMotifs.length === 0 ? (
                <p className="scene-badges__empty">No scene elements yet.</p>
              ) : (
                visibleMotifs.map((element: SceneElement) => (
                  <span
                    className="scene-badge"
                    data-testid="scene-badge"
                    key={element.id}
                  >
                    {element.motif} {Math.round(element.confidence * 100)}%
                  </span>
                ))
              )}
            </div>

            <div className="session-controls" role="group" aria-label="Canvas controls">
              <button
                disabled={strokes.length === 0 || sessionState !== "playing"}
                onClick={() => {
                  void pause();
                }}
                type="button"
              >
                Pause
              </button>
              <button
                disabled={strokes.length === 0}
                onClick={() => {
                  void replay();
                }}
                type="button"
              >
                Replay
              </button>
              <button
                disabled={strokes.length === 0}
                onClick={() => {
                  setGuidedAttempts((currentAttempts) => {
                    if (strokes.length === 0) {
                      return currentAttempts;
                    }

                    const nextAttempts = { ...currentAttempts };
                    const latestStroke = strokes.at(-1);

                    if (latestStroke) {
                      delete nextAttempts[latestStroke.id];
                    }

                    return nextAttempts;
                  });
                  dispatch({ type: "undo" });
                }}
                type="button"
              >
                Undo
              </button>
              <button
                disabled={strokes.length === 0}
                onClick={() => {
                  void resetSession();
                }}
                type="button"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="status-card">
            <p className="eyebrow">Next handoff</p>
            <ul>
              <li>Connect scene elements to audio layer state and playback</li>
              <li>Map motifs to deterministic ambience presets</li>
              <li>Expose session replay and pause controls</li>
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}
