import { useReducer } from "react";
import { useAudioSession } from "../features/audio/hooks/useAudioSession";
import { deriveAudioLayers } from "../features/audio/model/audioLayers";
import { CanvasSurface } from "../features/canvas/CanvasSurface";
import { strokeSessionReducer } from "../features/canvas/model/strokeSession";
import { classifyStrokes } from "../features/scene/model/classifyScene";
import type { SceneElement, Stroke } from "../shared/types/domain";
import "./App.css";

export function App() {
  const [strokes, dispatch] = useReducer(strokeSessionReducer, [] as Stroke[]);
  const sceneElements = classifyStrokes(strokes);
  const { pause, replay, reset: resetAudio, sessionState } =
    useAudioSession(sceneElements);
  const audioLayers = deriveAudioLayers(sceneElements, sessionState);
  const visibleMotifs = sceneElements.slice(-3);

  const resetSession = async () => {
    dispatch({ type: "reset" });
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
          }}
          strokes={strokes}
        />

        <aside className="status-panel" aria-label="Session status">
          <div className="status-card">
            <p className="eyebrow">Drawing status</p>
            <h2>Canvas snapshot</h2>
            <dl>
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
