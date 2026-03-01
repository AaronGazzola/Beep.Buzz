import { test, expect } from "@playwright/test";
import {
  generateTestCredentials,
  deleteTestUserByEmail,
} from "../helpers/auth-test-client";

test.describe("Sign Up", () => {
  let createdEmail = "";

  test.afterEach(async () => {
    if (createdEmail) {
      await deleteTestUserByEmail(createdEmail).catch(() => {});
      createdEmail = "";
    }
  });

  test("submitting valid credentials redirects to /verify and shows confirmation", async ({
    page,
  }) => {
    const creds = generateTestCredentials("e2esignup");
    createdEmail = creds.email;

    await page.goto("/sign-up");
    await page.getByTestId("sign-up-email").fill(creds.email);
    await page.getByTestId("sign-up-username").fill(creds.username);
    await page.getByTestId("sign-up-password").fill(creds.password);
    await page.getByTestId("sign-up-age-confirm").click();

    await expect(page.getByTestId("sign-up-submit")).toBeEnabled({
      timeout: 10000,
    });
    await page.getByTestId("sign-up-submit").click();

    await page.waitForURL("**/verify", { timeout: 15000 });
    await expect(
      page.getByRole("heading", { name: "Check Your Email" })
    ).toBeVisible();
  });

  test("/verify page shows resend verification email button", async ({
    page,
  }) => {
    await page.goto("/verify");
    await expect(
      page.getByRole("button", { name: /resend/i })
    ).toBeVisible();
  });
});
