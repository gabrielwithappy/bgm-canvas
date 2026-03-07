import { CanvasSurface } from "../features/canvas/CanvasSurface";
import "./App.css";

const stubSceneElements = 0;
const stubAudioLayers = 0;

export function App() {
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
        <CanvasSurface />

        <aside className="status-panel" aria-label="Session status">
          <div className="status-card">
            <p className="eyebrow">Shared contract</p>
            <h2>Bootstrap snapshot</h2>
            <dl>
              <div>
                <dt>Scene elements</dt>
                <dd>{stubSceneElements}</dd>
              </div>
              <div>
                <dt>Audio layers</dt>
                <dd>{stubAudioLayers}</dd>
              </div>
              <div>
                <dt>Audio state</dt>
                <dd>idle</dd>
              </div>
            </dl>
          </div>

          <div className="status-card">
            <p className="eyebrow">Next handoff</p>
            <ul>
              <li>Canvas pointer input and stroke storage</li>
              <li>Undo and reset reducer with failing tests first</li>
              <li>Scene and audio domains once the canvas contract is stable</li>
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}
