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
  await expect(page.getByText("Bootstrap snapshot")).toBeVisible();
});
