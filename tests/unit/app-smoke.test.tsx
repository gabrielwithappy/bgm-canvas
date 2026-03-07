import { render, screen } from "@testing-library/react";
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
    expect(screen.getByText("idle")).toBeInTheDocument();
  });
});
