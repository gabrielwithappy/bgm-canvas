type CanvasSurfaceProps = {
  width?: number;
  height?: number;
};

export function CanvasSurface({
  width = 960,
  height = 540,
}: CanvasSurfaceProps) {
  return (
    <section className="canvas-panel" aria-labelledby="canvas-title">
      <div className="canvas-panel__header">
        <div>
          <p className="eyebrow">Stage 0 bootstrap</p>
          <h2 id="canvas-title">Draw directly on the canvas</h2>
        </div>
        <p className="canvas-panel__hint">
          Single black line drawing starts here. Interaction wiring lands in the
          next slice.
        </p>
      </div>

      <div className="canvas-frame">
        <canvas
          aria-label="BGM Canvas drawing surface"
          className="canvas-surface"
          height={height}
          width={width}
        />
      </div>
    </section>
  );
}
