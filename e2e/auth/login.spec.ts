import type { Page } from "@playwright/test";
import { test, expect } from "../fixtures/auth";
import {
  isAuthenticated,
  waitForSessionClear,
} from "../helpers/session-helpers";

async function signIn(page: Page, email: string, password: string) {
  await page.goto("/sign-in");
  await page.getByTestId("sign-in-email").fill(email);
  await page.getByTestId("sign-in-password").fill(password);
  await page.getByTestId("sign-in-submit").click();
  await page.waitForURL((url) => !url.pathname.includes("sign-in"), {
    timeout: 15000,
  });
}

test.describe("Sign In", () => {
  test("valid credentials set session token in localStorage", async ({
    page,
    testUser,
  }) => {
    await signIn(page, testUser.email, testUser.password);
    expect(await isAuthenticated(page)).toBe(true);
  });

  test("invalid credentials show an error alert and stay on sign-in", async ({
    page,
  }) => {
    await page.goto("/sign-in");
    await page.getByTestId("sign-in-email").fill("wrong@test.example.com");
    await page.getByTestId("sign-in-password").fill("WrongPassword!");
    await page.getByTestId("sign-in-submit").click();

    await expect(page.getByRole("alert")).toBeVisible({ timeout: 10000 });
    expect(page.url()).toContain("sign-in");
  });

  test("session token persists after page reload", async ({
    page,
    testUser,
  }) => {
    await signIn(page, testUser.email, testUser.password);
    await page.reload();
    expect(await isAuthenticated(page)).toBe(true);
  });
});

test.describe("Sign Out", () => {
  test("clears session token from localStorage", async ({ page, testUser }) => {
    await signIn(page, testUser.email, testUser.password);

    await page.getByTestId("user-menu-trigger").click();
    await page.getByTestId("signout-button").click();

    await waitForSessionClear(page);
    expect(await isAuthenticated(page)).toBe(false);
  });
});
