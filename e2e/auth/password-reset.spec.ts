import { test, expect } from "@playwright/test";

test.describe("Password Reset", () => {
  test("forgot password link on sign-in navigates to forgot-password page", async ({
    page,
  }) => {
    await page.goto("/sign-in");
    await page.getByRole("link", { name: "Forgot password?" }).click();
    await expect(
      page.getByRole("heading", { name: "Forgot Password" })
    ).toBeVisible();
  });

  test("malformed email fails HTML5 validation", async ({ page }) => {
    await page.goto("/forgot-password");
    const emailInput = page.getByTestId("forgot-password-email");
    await emailInput.fill("notanemail");

    const isValid = await emailInput.evaluate(
      (el: HTMLInputElement) => el.validity.valid
    );
    expect(isValid).toBe(false);
  });

  test("valid email submission shows success confirmation", async ({
    page,
  }) => {
    await page.goto("/forgot-password");
    await page.getByTestId("forgot-password-email").fill("test@test.example.com");
    await page.getByTestId("forgot-password-submit").click();

    await expect(
      page.getByRole("heading", { name: "Check Your Email" })
    ).toBeVisible({ timeout: 10000 });
  });
});
