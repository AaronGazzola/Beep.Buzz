import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const PASSWORD = "TestPassword123!";

export type TestUser = {
  email: string;
  password: string;
  userId: string;
  username: string;
};

export type ChatTestData = {
  userA: TestUser;
  userB: TestUser;
};

export async function createChatTestUsers(): Promise<ChatTestData> {
  const ts = String(Date.now()).slice(-8);
  const usernameA = `e2ea${ts}`;
  const usernameB = `e2eb${ts}`;
  const emailA = `${usernameA}@test.example.com`;
  const emailB = `${usernameB}@test.example.com`;

  const { data: authA, error: errA } = await supabaseAdmin.auth.admin.createUser({
    email: emailA,
    password: PASSWORD,
    email_confirm: true,
    user_metadata: { username: usernameA },
  });
  if (errA || !authA.user) throw new Error(`Failed to create user A: ${errA?.message}`);

  const { data: authB, error: errB } = await supabaseAdmin.auth.admin.createUser({
    email: emailB,
    password: PASSWORD,
    email_confirm: true,
    user_metadata: { username: usernameB },
  });
  if (errB || !authB.user) throw new Error(`Failed to create user B: ${errB?.message}`);

  await new Promise((r) => setTimeout(r, 500));

  return {
    userA: { email: emailA, password: PASSWORD, userId: authA.user.id, username: usernameA },
    userB: { email: emailB, password: PASSWORD, userId: authB.user.id, username: usernameB },
  };
}

export async function cleanupChatTestUsers(data: ChatTestData): Promise<void> {
  const { userA, userB } = data;

  await supabaseAdmin
    .from("direct_messages")
    .delete()
    .or(`sender_id.eq.${userA.userId},sender_id.eq.${userB.userId}`);

  await supabaseAdmin.auth.admin.deleteUser(userA.userId);
  await supabaseAdmin.auth.admin.deleteUser(userB.userId);
}
