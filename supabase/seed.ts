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

async function seed() {
  console.log("Starting database seed...");

  const testUsers = [
    {
      email: "aaron@gazzola.dev",
      password: "Password123!",
      username: "admin",
      role: "super-admin" as const,
    },
    {
      email: "user1@example.com",
      password: "Password123!",
      username: "alice",
      role: "user" as const,
    },
    {
      email: "user2@example.com",
      password: "Password123!",
      username: "bob",
      role: "user" as const,
    },
  ];

  const createdProfiles: Array<{
    userId: string;
    profileId: string;
    username: string;
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
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .insert({
          user_id: authData.user.id,
          username: userData.username,
          role: userData.role,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (profileError) {
        console.error(
          `Error creating profile for ${userData.email}:`,
          profileError
        );
      } else if (profileData) {
        console.log(`Created profile for ${userData.username}`);
        createdProfiles.push({
          userId: authData.user.id,
          profileId: profileData.id,
          username: userData.username,
        });
      }
    }
  }

  if (createdProfiles.length > 0) {
    const aliceProfile = createdProfiles.find((p) => p.username === "alice");
    const bobProfile = createdProfiles.find((p) => p.username === "bob");

    if (aliceProfile) {
      const { data: pageData, error: pageError } = await supabase
        .from("pages")
        .insert({
          profile_id: aliceProfile.profileId,
          user_id: aliceProfile.userId,
          title: "My First Page",
          status: "PUBLISHED",
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (pageError) {
        console.error("Error creating page for Alice:", pageError);
      } else if (pageData) {
        console.log("Created page for Alice");

        const { error: elementsError } = await supabase
          .from("page_elements")
          .insert([
            {
              page_id: pageData.id,
              user_id: aliceProfile.userId,
              type: "TEXT",
              content: { text: "Welcome to my page!" },
              position: 0,
              updated_at: new Date().toISOString(),
            },
            {
              page_id: pageData.id,
              user_id: aliceProfile.userId,
              type: "SHAPE",
              content: { shape: "circle", color: "#ff0000" },
              position: 1,
              updated_at: new Date().toISOString(),
            },
          ]);

        if (elementsError) {
          console.error("Error creating page elements:", elementsError);
        } else {
          console.log("Created page elements for Alice");
        }

        if (bobProfile) {
          const { data: stickerData, error: stickerError } = await supabase
            .from("stickers")
            .insert({
              profile_id: bobProfile.profileId,
              user_id: bobProfile.userId,
              type: "BEEP",
              style: { size: "medium", color: "#00ff00" },
              updated_at: new Date().toISOString(),
            })
            .select()
            .single();

          if (stickerError) {
            console.error("Error creating sticker:", stickerError);
          } else if (stickerData) {
            console.log("Created sticker for Bob");

            const { data: pageElementData } = await supabase
              .from("page_elements")
              .select("id")
              .eq("page_id", pageData.id)
              .limit(1)
              .single();

            if (pageElementData) {
              const { error: placementError } = await supabase
                .from("sticker_placements")
                .insert({
                  sticker_id: stickerData.id,
                  page_element_id: pageElementData.id,
                  user_id: bobProfile.userId,
                  position_x: 100,
                  position_y: 50,
                });

              if (placementError) {
                console.error("Error creating sticker placement:", placementError);
              } else {
                console.log("Created sticker placement on Alice's page");
              }
            }
          }
        }
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
