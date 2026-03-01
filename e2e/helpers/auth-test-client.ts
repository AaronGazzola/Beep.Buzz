import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const TEST_PASSWORD = "TestPassword123!";

export type TestUser = {
  email: string;
  password: string;
  userId: string;
  username: string;
};

export type LearnedLetter = {
  letter: string;
  practiceCount: number;
};

export function generateTestCredentials(prefix = "e2eauth") {
  const ts = String(Date.now()).slice(-8);
  const username = `${prefix}${ts}`;
  return {
    email: `${username}@test.example.com`,
    password: TEST_PASSWORD,
    username,
  };
}

export async function createTestUser(
  prefix = "e2eauth",
  emailConfirmed = true,
  pendingLearnedLetters?: LearnedLetter[]
): Promise<TestUser> {
  const creds = generateTestCredentials(prefix);

  const user_metadata: Record<string, unknown> = { username: creds.username };
  if (pendingLearnedLetters) {
    user_metadata.pending_learned_letters = pendingLearnedLetters;
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: creds.email,
    password: creds.password,
    email_confirm: emailConfirmed,
    user_metadata,
  });

  if (error || !data.user) {
    throw new Error(`Failed to create test user: ${error?.message}`);
  }

  return {
    email: creds.email,
    password: creds.password,
    userId: data.user.id,
    username: creds.username,
  };
}

export async function deleteTestUser(userId: string): Promise<void> {
  await supabaseAdmin.auth.admin.deleteUser(userId);
}

export async function deleteTestUserByEmail(email: string): Promise<void> {
  const { data } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
  const user = data?.users.find((u) => u.email === email);
  if (user) {
    await supabaseAdmin.auth.admin.deleteUser(user.id);
  }
}

export async function getProfileLearnedLetters(userId: string): Promise<LearnedLetter[]> {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("learned_letters")
    .eq("user_id", userId)
    .single();

  if (error) throw new Error(`Failed to get learned letters: ${error.message}`);
  return (data?.learned_letters as unknown as LearnedLetter[]) ?? [];
}

export async function setProfileLearnedLetters(userId: string, letters: LearnedLetter[]): Promise<void> {
  const { error } = await supabaseAdmin
    .from("profiles")
    .update({ learned_letters: letters })
    .eq("user_id", userId);

  if (error) throw new Error(`Failed to set learned letters: ${error.message}`);
}
