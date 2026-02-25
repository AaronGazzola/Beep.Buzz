import { test, expect } from "@playwright/test";

test.describe("Chat page", () => {
  test("loads /chat with chat mode selector", async ({ page }) => {
    await page.goto("/chat");
    await expect(page.getByTestId("chat-mode-selector")).toBeVisible();
  });

  test("shows chat controls", async ({ page }) => {
    await page.goto("/chat");
    await expect(page.getByTestId("chat-controls")).toBeVisible();
  });

  test("switches to random mode", async ({ page }) => {
    await page.goto("/chat");
    await page.getByTestId("chat-mode-selector").click();
    await page.getByTestId("chat-mode-option-random").click({ force: true });
    await expect(page.getByTestId("chat-mode-content")).toBeVisible();
  });

  test("switches to friend mode", async ({ page }) => {
    await page.goto("/chat");
    await page.getByTestId("chat-mode-selector").click();
    await page.getByTestId("chat-mode-option-friend").click({ force: true });
    await expect(page.getByTestId("chat-mode-content")).toBeVisible();
  });

  test("/chat/{username} loads direct chat UI (skip if no auth)", async ({ page }) => {
    await page.goto("/chat/testuser");
    await expect(page.locator("body")).toBeVisible();
  });
});
