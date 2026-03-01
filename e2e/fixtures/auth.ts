import { test as base } from "@playwright/test";
import {
  createTestUser,
  deleteTestUser,
  type TestUser,
} from "../helpers/auth-test-client";

type AuthFixtures = {
  testUser: TestUser;
};

export const test = base.extend<AuthFixtures>({
  testUser: async ({}, use) => {
    const user = await createTestUser("e2elogin");
    await use(user);
    await deleteTestUser(user.userId);
  },
});

export { expect } from "@playwright/test";
