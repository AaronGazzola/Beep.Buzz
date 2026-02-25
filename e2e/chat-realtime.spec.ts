import { test, expect, type Page, type Browser } from "@playwright/test";
import {
  createChatTestUsers,
  cleanupChatTestUsers,
  type ChatTestData,
} from "./helpers/setup-chat-users";

let testData: ChatTestData;

async function signIn(page: Page, email: string, password: string) {
  await page.goto("/sign-in");
  await page.getByTestId("sign-in-email").fill(email);
  await page.getByTestId("sign-in-password").fill(password);
  await page.getByTestId("sign-in-submit").click();
  await page.waitForURL((url) => !url.pathname.includes("sign-in"), {
    timeout: 15000,
  });
}

async function openChat(
  browser: Browser,
  email: string,
  password: string,
  partnerUsername: string
) {
  const context = await browser.newContext();
  const page = await context.newPage();
  await signIn(page, email, password);
  await page.goto(`/chat/${partnerUsername}`);
  await page.getByTestId("chat-area").waitFor({ timeout: 15000 });
  await page.waitForTimeout(3000);
  return { context, page };
}

async function sendMorseDot(page: Page) {
  await page.keyboard.down(" ");
  await page.waitForTimeout(80);
  await page.keyboard.up(" ");
}

async function sendMorseDash(page: Page) {
  await page.keyboard.down(" ");
  await page.waitForTimeout(300);
  await page.keyboard.up(" ");
}

async function focusChatArea(page: Page) {
  await page.evaluate(() => {
    (document.activeElement as HTMLElement)?.blur();
  });
  await page.waitForTimeout(100);
}

test.describe.serial("Chat realtime (two users)", () => {
  test.setTimeout(120000);

  test.beforeAll(async () => {
    testData = await createChatTestUsers();
  });

  test.afterAll(async () => {
    if (testData) await cleanupChatTestUsers(testData);
  });

  test("User A sends morse signal, User B sees partner input in real time", async ({
    browser,
  }) => {
    const a = await openChat(
      browser,
      testData.userA.email,
      testData.userA.password,
      testData.userB.username
    );
    const b = await openChat(
      browser,
      testData.userB.email,
      testData.userB.password,
      testData.userA.username
    );

    try {
      await focusChatArea(a.page);
      await focusChatArea(b.page);

      await sendMorseDot(a.page);

      await expect(
        a.page.getByTestId("user-morse-input-morse")
      ).toBeVisible({ timeout: 5000 });

      await expect(
        b.page.getByTestId("partner-morse-input-morse")
      ).toBeVisible({ timeout: 10000 });
    } finally {
      await a.context.close();
      await b.context.close();
    }
  });

  test("User A sends full morse message, User B receives it via realtime DB insert", async ({
    browser,
  }) => {
    const a = await openChat(
      browser,
      testData.userA.email,
      testData.userA.password,
      testData.userB.username
    );
    const b = await openChat(
      browser,
      testData.userB.email,
      testData.userB.password,
      testData.userA.username
    );

    try {
      await focusChatArea(a.page);

      await sendMorseDot(a.page);
      await a.page.waitForTimeout(100);
      await sendMorseDot(a.page);

      await expect(
        a.page.getByTestId("user-morse-input-morse")
      ).toBeVisible({ timeout: 5000 });

      const speedWpm = 15;
      const ditDuration = 1200 / speedWpm;
      const messageEndTimeout = ditDuration * 14 + ditDuration * 7 + ditDuration * 3 + 2000;
      await a.page.waitForTimeout(messageEndTimeout);

      await expect(
        b.page.getByTestId("message-0-translation")
      ).toBeVisible({ timeout: 15000 });
    } finally {
      await a.context.close();
      await b.context.close();
    }
  });

  test("bidirectional: both users exchange morse signals", async ({ browser }) => {
    const a = await openChat(
      browser,
      testData.userA.email,
      testData.userA.password,
      testData.userB.username
    );
    const b = await openChat(
      browser,
      testData.userB.email,
      testData.userB.password,
      testData.userA.username
    );

    try {
      await focusChatArea(a.page);
      await focusChatArea(b.page);

      await sendMorseDash(a.page);

      await expect(
        a.page.getByTestId("user-morse-input-morse")
      ).toBeVisible({ timeout: 5000 });

      await expect(
        b.page.getByTestId("partner-morse-input-morse")
      ).toBeVisible({ timeout: 10000 });

      await sendMorseDot(b.page);

      await expect(
        b.page.getByTestId("user-morse-input-morse")
      ).toBeVisible({ timeout: 5000 });

      await expect(
        a.page.getByTestId("partner-morse-input-morse")
      ).toBeVisible({ timeout: 10000 });
    } finally {
      await a.context.close();
      await b.context.close();
    }
  });
});
