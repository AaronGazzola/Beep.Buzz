import type { Database } from "@/supabase/types";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY!;

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function waitForProfile(userId: string, maxAttempts = 10): Promise<string | null> {
  for (let i = 0; i < maxAttempts; i++) {
    const { data } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (data) {
      return data.id;
    }

    await new Promise(resolve => setTimeout(resolve, 500));
  }
  return null;
}

async function seed() {
  console.log("Starting database seed...");

  const testUsers = [
    {
      email: "az@beep.buzz",
      password: "Password123!",
      role: "super-admin" as const,
    },
    {
      email: "user1@example.com",
      password: "Password123!",
      role: "user" as const,
    },
    {
      email: "user2@example.com",
      password: "Password123!",
      role: "user" as const,
    },
  ];

  const createdUsers: Array<{
    userId: string;
    profileId: string;
    email: string;
    role: Database["public"]["Enums"]["user_role"];
  }> = [];

  for (const userData of testUsers) {
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
      });

    if (authError) {
      console.error(`Error creating user ${userData.email}:`, authError);
      continue;
    }

    console.log(`Created auth user: ${userData.email}`);

    if (authData.user) {
      const profileId = await waitForProfile(authData.user.id);

      if (!profileId) {
        console.error(`Profile not created for ${userData.email} after waiting`);
        continue;
      }

      console.log(`Profile created by trigger for ${userData.email}`);

      if (userData.role !== "user") {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ role: userData.role })
          .eq("user_id", authData.user.id);

        if (updateError) {
          console.error(`Error updating role for ${userData.email}:`, updateError);
        } else {
          console.log(`Updated role to ${userData.role} for ${userData.email}`);
        }
      }

      createdUsers.push({
        userId: authData.user.id,
        profileId,
        email: userData.email,
        role: userData.role,
      });
    }
  }

  if (createdUsers.length > 0) {
    const user1 = createdUsers[1];
    const user2 = createdUsers[2];

    const { data: achievementsData, error: achievementsError } = await supabase
      .from("achievements")
      .insert([
        {
          title: "First Steps",
          description: "Complete your first practice session",
          type: "progress",
          points: 10,
        },
        {
          title: "Speed Demon",
          description: "Achieve 95% accuracy in a speed challenge",
          type: "skill",
          points: 50,
        },
        {
          title: "Early Adopter",
          description: "Join during beta testing",
          type: "special",
          points: 100,
        },
      ])
      .select();

    if (achievementsError) {
      console.error("Error creating achievements:", achievementsError);
    } else {
      console.log(`Created ${achievementsData?.length} achievements`);
    }

    if (user1 && user2) {
      const { error: practiceError } = await supabase
        .from("practice_sessions")
        .insert([
          {
            user_id: user1.userId,
            exercise_type: "translation",
            difficulty: "beginner",
            completion_time: 120,
            accuracy: 85.5,
            words_attempted: 20,
            words_correct: 17,
          },
          {
            user_id: user2.userId,
            exercise_type: "morse_input",
            difficulty: "intermediate",
            completion_time: 180,
            accuracy: 92.0,
            words_attempted: 25,
            words_correct: 23,
          },
        ]);

      if (practiceError) {
        console.error("Error creating practice sessions:", practiceError);
      } else {
        console.log("Created sample practice sessions");
      }

      const { error: matchError } = await supabase
        .from("matches")
        .insert({
          user_id: user1.userId,
          opponent_id: user2.userId,
          status: "completed",
          user_score: 15,
          opponent_score: 12,
          completion_time: 240,
          accuracy: 88.5,
        });

      if (matchError) {
        console.error("Error creating match:", matchError);
      } else {
        console.log("Created sample match");
      }

      const { error: rankingsError } = await supabase
        .from("leaderboard_rankings")
        .insert([
          {
            user_id: user1.userId,
            category: "accuracy",
            score: 85.5,
            rank: 2,
          },
          {
            user_id: user2.userId,
            category: "accuracy",
            score: 92.0,
            rank: 1,
          },
        ]);

      if (rankingsError) {
        console.error("Error creating leaderboard rankings:", rankingsError);
      } else {
        console.log("Created sample leaderboard rankings");
      }
    }
  }

  console.log("Seed complete!");
}

seed()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .then(() => {
    process.exit(0);
  });
