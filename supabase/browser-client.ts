import { ENV, getBrowserAPI } from "@/lib/env.utils";
import type { Database } from "@/supabase/types";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

let client: ReturnType<typeof createSupabaseClient<Database>> | null = null;

export function createClient() {
  if (client) return client;

  client = createSupabaseClient<Database>(
    ENV.SUPABASE_URL,
    ENV.SUPABASE_PUBLISHABLE_KEY,
    {
      auth: {
        storage: getBrowserAPI(() => localStorage),
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    }
  );

  return client;
}
