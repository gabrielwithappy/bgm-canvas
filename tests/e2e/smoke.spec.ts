import { test, expect } from "@playwright/test";

test("loads the bootstrap canvas shell", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: /sketch a scene, then let the soundscape grow with it/i,
    }),
  ).toBeVisible();
  await expect(
    page.getByLabel("BGM Canvas drawing surface"),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Canvas snapshot" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Choose a motif guide" }),
  ).toBeVisible();
});

test("switches the selected guide and shows the matching overlay", async ({
  page,
}) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Rain guide" }).click();

  await expect(page.getByTestId("selected-guide")).toHaveText("Rain");
  await expect(page.getByLabel("Rain guide overlay")).toBeVisible();
});

test("maps a guided drawing to the selected motif badge", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Rain guide" }).click();

  const canvas = page.getByLabel("BGM Canvas drawing surface");
  await canvas.hover({ position: { x: 120, y: 200 } });
  await page.mouse.down();
  await page.mouse.move(280, 220, { steps: 8 });
  await page.mouse.up();

  await expect(page.getByTestId("guided-match-state")).toHaveText("matched");
  await expect(page.getByTestId("scene-badge").first()).toContainText("rain");
});

test("keeps a short guided stroke in failed state without a scene badge", async ({
  page,
}) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Rain guide" }).click();

  const canvas = page.getByLabel("BGM Canvas drawing surface");
  await canvas.hover({ position: { x: 120, y: 200 } });
  await page.mouse.down();
  await page.mouse.move(145, 206, { steps: 2 });
  await page.mouse.up();

  await expect(page.getByTestId("guided-match-state")).toHaveText("failed");
  await expect(page.getByTestId("scene-count")).toHaveText("0");
  await expect(page.getByTestId("audio-state")).toHaveText("idle");
  await expect(page.getByText("No scene elements yet.")).toBeVisible();
});

test("stores one stroke after drawing on the canvas", async ({ page }) => {
  await page.goto("/");

  const canvas = page.getByLabel("BGM Canvas drawing surface");
  await canvas.hover({ position: { x: 120, y: 220 } });
  await page.mouse.down();
  await page.mouse.move(150, 80, { steps: 8 });
  await page.mouse.up();

  await expect(page.getByTestId("stroke-count")).toHaveText("1");
  await expect(page.getByTestId("scene-count")).toHaveText("1");
  await expect(page.getByTestId("audio-layer-count")).toHaveText("1");
  await expect(page.getByTestId("audio-state")).toHaveText("playing");
  await expect(page.getByTestId("scene-badge").first()).toContainText("tree");
});

test("undo and reset control the current drawing session", async ({ page }) => {
  await page.goto("/");

  const canvas = page.getByLabel("BGM Canvas drawing surface");
  const pauseButton = page.getByRole("button", { name: "Pause" });
  const replayButton = page.getByRole("button", { name: "Replay" });
  const undoButton = page.getByRole("button", { name: "Undo" });
  const resetButton = page.getByRole("button", { name: "Reset" });

  await expect(pauseButton).toBeDisabled();
  await expect(replayButton).toBeDisabled();
  await expect(undoButton).toBeDisabled();
  await expect(resetButton).toBeDisabled();

  await canvas.hover({ position: { x: 120, y: 120 } });
  await page.mouse.down();
  await page.mouse.move(260, 200, { steps: 8 });
  await page.mouse.up();

  await canvas.hover({ position: { x: 200, y: 180 } });
  await page.mouse.down();
  await page.mouse.move(360, 240, { steps: 8 });
  await page.mouse.up();

  await expect(page.getByTestId("stroke-count")).toHaveText("2");
  await expect(page.getByTestId("audio-state")).toHaveText("playing");

  await pauseButton.click();
  await expect(page.getByTestId("audio-state")).toHaveText("paused");

  await replayButton.click();
  await expect(page.getByTestId("audio-state")).toHaveText("playing");

  await undoButton.click();
  await expect(page.getByTestId("stroke-count")).toHaveText("1");

  await resetButton.click();
  await expect(page.getByTestId("stroke-count")).toHaveText("0");
  await expect(page.getByTestId("audio-state")).toHaveText("idle");
  await expect(undoButton).toBeDisabled();
  await expect(resetButton).toBeDisabled();
});
