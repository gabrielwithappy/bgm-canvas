import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { App } from "../../src/app/App";

describe("App bootstrap", () => {
  it("renders the empty canvas workspace and bootstrap status", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", {
        name: /sketch a scene, then let the soundscape grow with it/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: /bgm canvas workspace/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/bgm canvas drawing surface/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /choose a motif guide/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /campfire guide/i }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("audio-state")).toHaveTextContent("idle");
  });

  it("shows the selected guide in the status panel and canvas overlay", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /rain guide/i }));

    expect(screen.getByTestId("selected-guide")).toHaveTextContent("Rain");
    expect(
      screen.getByLabelText(/rain guide overlay/i),
    ).toBeInTheDocument();
  });

  it("stores a completed stroke after pointer drawing", async () => {
    render(<App />);

    const canvas = screen.getByLabelText(
      /bgm canvas drawing surface/i,
    ) as HTMLCanvasElement;

    canvas.getBoundingClientRect = () =>
      ({
        left: 0,
        top: 0,
        width: 960,
        height: 540,
        right: 960,
        bottom: 540,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }) as DOMRect;

    fireEvent.pointerDown(canvas, {
      clientX: 10,
      clientY: 10,
      pointerId: 1,
      buttons: 1,
    });
    fireEvent.pointerMove(canvas, {
      clientX: 110,
      clientY: 90,
      pointerId: 1,
      buttons: 1,
    });
    fireEvent.pointerUp(canvas, {
      clientX: 110,
      clientY: 90,
      pointerId: 1,
    });

    await waitFor(() => {
      expect(screen.getByTestId("stroke-count")).toHaveTextContent("1");
      expect(screen.getByTestId("scene-count")).toHaveTextContent("1");
      expect(screen.getByTestId("audio-layer-count")).toHaveTextContent("1");
      expect(screen.getByTestId("audio-state")).toHaveTextContent("playing");
    });
    expect(screen.getByText(/single black line active/i)).toBeInTheDocument();
  });

  it("undoes the most recent stroke and resets the session", async () => {
    render(<App />);

    const canvas = screen.getByLabelText(
      /bgm canvas drawing surface/i,
    ) as HTMLCanvasElement;

    canvas.getBoundingClientRect = () =>
      ({
        left: 0,
        top: 0,
        width: 960,
        height: 540,
        right: 960,
        bottom: 540,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }) as DOMRect;

    const pauseButton = screen.getByRole("button", { name: /pause/i });
    const replayButton = screen.getByRole("button", { name: /replay/i });
    const undoButton = screen.getByRole("button", { name: /undo/i });
    const resetButton = screen.getByRole("button", { name: /reset/i });

    expect(pauseButton).toBeDisabled();
    expect(replayButton).toBeDisabled();
    expect(undoButton).toBeDisabled();
    expect(resetButton).toBeDisabled();

    fireEvent.pointerDown(canvas, {
      clientX: 10,
      clientY: 10,
      pointerId: 1,
      buttons: 1,
    });
    fireEvent.pointerMove(canvas, {
      clientX: 110,
      clientY: 90,
      pointerId: 1,
      buttons: 1,
    });
    fireEvent.pointerUp(canvas, {
      clientX: 110,
      clientY: 90,
      pointerId: 1,
    });

    fireEvent.pointerDown(canvas, {
      clientX: 20,
      clientY: 30,
      pointerId: 2,
      buttons: 1,
    });
    fireEvent.pointerMove(canvas, {
      clientX: 180,
      clientY: 120,
      pointerId: 2,
      buttons: 1,
    });
    fireEvent.pointerUp(canvas, {
      clientX: 180,
      clientY: 120,
      pointerId: 2,
    });

    await waitFor(() => {
      expect(screen.getByTestId("stroke-count")).toHaveTextContent("2");
      expect(screen.getByTestId("audio-state")).toHaveTextContent("playing");
      expect(screen.getByTestId("audio-layer-count")).toHaveTextContent("2");
      expect(pauseButton).toBeEnabled();
      expect(replayButton).toBeEnabled();
      expect(undoButton).toBeEnabled();
      expect(resetButton).toBeEnabled();
    });

    fireEvent.click(pauseButton);
    await waitFor(() => {
      expect(screen.getByTestId("audio-state")).toHaveTextContent("paused");
    });

    fireEvent.click(replayButton);
    await waitFor(() => {
      expect(screen.getByTestId("audio-state")).toHaveTextContent("playing");
    });

    fireEvent.click(undoButton);
    await waitFor(() => {
      expect(screen.getByTestId("stroke-count")).toHaveTextContent("1");
      expect(screen.getByTestId("scene-count")).toHaveTextContent("1");
      expect(screen.getByTestId("audio-layer-count")).toHaveTextContent("1");
    });

    fireEvent.click(resetButton);
    await waitFor(() => {
      expect(screen.getByTestId("stroke-count")).toHaveTextContent("0");
      expect(screen.getByTestId("scene-count")).toHaveTextContent("0");
      expect(screen.getByTestId("audio-layer-count")).toHaveTextContent("0");
      expect(screen.getByTestId("audio-state")).toHaveTextContent("idle");
      expect(pauseButton).toBeDisabled();
      expect(replayButton).toBeDisabled();
      expect(undoButton).toBeDisabled();
      expect(resetButton).toBeDisabled();
    });
  });
});
