import { createClient } from "@/supabase/server-client";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error(error);
      return NextResponse.redirect(
        new URL("/sign-in?error=auth_failed", request.url)
      );
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("user_id", user.id)
        .single();

      if (!profile?.username) {
        return NextResponse.redirect(new URL("/welcome", request.url));
      }
    }
  }

  return NextResponse.redirect(new URL("/", request.url));
}
