import { test, expect, type Page } from "@playwright/test";
import {
  createTestUser,
  deleteTestUser,
  getProfileLearnedLetters,
  setProfileLearnedLetters,
  type LearnedLetter,
} from "../helpers/auth-test-client";
import { waitForSessionClear } from "../helpers/session-helpers";

const TEST_LETTERS: LearnedLetter[] = [
  { letter: "E", practiceCount: 1 },
  { letter: "S", practiceCount: 3 },
];

async function signIn(page: Page, email: string, password: string) {
  await page.goto("/sign-in");
  await page.getByTestId("sign-in-email").fill(email);
  await page.getByTestId("sign-in-password").fill(password);
  await page.getByTestId("sign-in-submit").click();
  await page.waitForURL((url) => !url.pathname.includes("sign-in"), {
    timeout: 15000,
  });
}

test.describe("Learned letters — DB persistence", () => {
  test("pending_learned_letters in signup metadata are written to profiles by DB trigger", async () => {
    const user = await createTestUser("e2eletters", true, TEST_LETTERS);
    try {
      const letters = await getProfileLearnedLetters(user.userId);
      expect(letters).toEqual(TEST_LETTERS);
    } finally {
      await deleteTestUser(user.userId);
    }
  });
});

test.describe("Learned letters — authenticated UI", () => {
  test("learned letters stored in DB are shown in the UI after sign in", async ({ page }) => {
    const user = await createTestUser("e2eletters");
    try {
      await setProfileLearnedLetters(user.userId, TEST_LETTERS);
      await signIn(page, user.email, user.password);
      await expect(
        page.getByTestId("learned-letters-heading")
      ).toBeVisible({ timeout: 10000 });
    } finally {
      await deleteTestUser(user.userId);
    }
  });

  test("learned letters are cleared from UI after sign out", async ({ page }) => {
    const user = await createTestUser("e2eletters");
    try {
      await setProfileLearnedLetters(user.userId, TEST_LETTERS);
      await signIn(page, user.email, user.password);
      await expect(
        page.getByTestId("learned-letters-heading")
      ).toBeVisible({ timeout: 10000 });

      await page.getByTestId("user-menu-trigger").click();
      await page.getByTestId("signout-button").click();
      await waitForSessionClear(page);

      await expect(
        page.getByTestId("learned-letters-heading")
      ).not.toBeVisible();
    } finally {
      await deleteTestUser(user.userId);
    }
  });
});

test.describe("Learned letters — unauthenticated state", () => {
  test("learned letters are shown from local Zustand state when not signed in", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        "game-storage",
        JSON.stringify({
          state: {
            learnedLetters: [
              { letter: "E", practiceCount: 1 },
              { letter: "S", practiceCount: 3 },
            ],
          },
          version: 0,
        })
      );
    });

    await page.goto("/");
    await expect(
      page.getByTestId("learned-letters-heading")
    ).toBeVisible();
  });
});
