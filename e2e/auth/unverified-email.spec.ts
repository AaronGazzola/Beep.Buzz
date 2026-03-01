import { test, expect } from "@playwright/test";
import { createTestUser, deleteTestUser } from "../helpers/auth-test-client";

test.describe("Unverified email sign in", () => {
  test("shows verification error when signing in with unconfirmed email", async ({
    page,
  }) => {
    const user = await createTestUser("e2eunverified", false);

    try {
      await page.goto("/sign-in");
      await page.getByTestId("sign-in-email").fill(user.email);
      await page.getByTestId("sign-in-password").fill(user.password);
      await page.getByTestId("sign-in-submit").click();

      await expect(page.getByRole("alert")).toBeVisible({ timeout: 10000 });
      await expect(page.getByRole("alert")).toContainText(/verify/i);
    } finally {
      await deleteTestUser(user.userId);
    }
  });
});
