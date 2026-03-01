import type { Page } from "@playwright/test";

export async function isAuthenticated(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    const keys = Object.keys(localStorage);
    return keys.some((k) => k.startsWith("sb-") && k.endsWith("-auth-token"));
  });
}

export async function waitForSessionClear(
  page: Page,
  timeout = 10000
): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (!(await isAuthenticated(page))) return;
    await page.waitForTimeout(100);
  }
  throw new Error("Session was not cleared within timeout");
}
