import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { Stroke } from "../../shared/types/domain";

type CanvasSurfaceProps = {
  strokes: Stroke[];
  onStrokeComplete: (stroke: Stroke) => void;
  width?: number;
  height?: number;
};

function createStrokeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `stroke-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function drawStroke(
  context: CanvasRenderingContext2D,
  stroke: Stroke,
  { isDraft = false }: { isDraft?: boolean } = {},
) {
  if (stroke.points.length === 0) {
    return;
  }

  context.save();
  context.lineCap = "round";
  context.lineJoin = "round";
  context.lineWidth = 6;
  context.strokeStyle = "#111111";
  context.globalAlpha = isDraft ? 0.72 : 1;
  context.beginPath();
  context.moveTo(stroke.points[0].x, stroke.points[0].y);

  for (const point of stroke.points.slice(1)) {
    context.lineTo(point.x, point.y);
  }

  if (stroke.points.length === 1) {
    context.lineTo(stroke.points[0].x + 0.01, stroke.points[0].y + 0.01);
  }

  context.stroke();
  context.restore();
}

export function CanvasSurface({
  strokes,
  onStrokeComplete,
  width = 960,
  height = 540,
}: CanvasSurfaceProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [draftStroke, setDraftStroke] = useState<Stroke | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) {
      return;
    }

    context.clearRect(0, 0, width, height);

    for (const stroke of strokes) {
      drawStroke(context, stroke);
    }

    if (draftStroke) {
      drawStroke(context, draftStroke, { isDraft: true });
    }
  }, [draftStroke, height, strokes, width]);

  const toCanvasPoint = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const scaleX = rect.width === 0 ? 1 : width / rect.width;
    const scaleY = rect.height === 0 ? 1 : height / rect.height;

    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const point = toCanvasPoint(event);
    const nextStroke: Stroke = {
      id: createStrokeId(),
      points: [point],
      createdAt: Date.now(),
    };

    event.currentTarget.setPointerCapture?.(event.pointerId);
    setDraftStroke(nextStroke);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!draftStroke) {
      return;
    }

    const point = toCanvasPoint(event);
    setDraftStroke((currentStroke) =>
      currentStroke
        ? {
            ...currentStroke,
            points: [...currentStroke.points, point],
          }
        : currentStroke,
    );
  };

  const finishStroke = () => {
    if (!draftStroke) {
      return;
    }

    onStrokeComplete(draftStroke);
    setDraftStroke(null);
  };

  return (
    <section className="canvas-panel" aria-labelledby="canvas-title">
      <div className="canvas-panel__header">
        <div>
          <p className="eyebrow">Stage 1 drawing</p>
          <h2 id="canvas-title">Draw directly on the canvas</h2>
        </div>
        <p className="canvas-panel__hint">
          Drag to sketch with a fixed single black line. Completed strokes are
          stored immediately.
        </p>
      </div>

      <div className="canvas-frame">
        <canvas
          aria-label="BGM Canvas drawing surface"
          className="canvas-surface"
          height={height}
          onPointerCancel={finishStroke}
          onPointerDown={handlePointerDown}
          onPointerLeave={finishStroke}
          onPointerMove={handlePointerMove}
          onPointerUp={finishStroke}
          ref={canvasRef}
          width={width}
        />
      </div>
    </section>
  );
}
