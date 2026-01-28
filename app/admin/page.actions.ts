"use server";

import { createClient } from "@/supabase/server-client";
import type { FlagStatus, ModAction, ApprovalStatus, ContentType } from "../layout.types";
import type {
  FlaggedContentWithReporter,
  ModerationLogWithAdmin,
  StickerDesignWithProfile,
} from "./page.types";

export async function getFlaggedContentAction(): Promise<FlaggedContentWithReporter[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: isAdmin } = await supabase.rpc("is_admin");

  if (!isAdmin) {
    throw new Error("Forbidden");
  }

  const { data: flags, error } = await supabase
    .from("content_flags")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const flagsWithReporter = await Promise.all(
    flags.map(async (flag) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", flag.user_id)
        .single();

      return {
        ...flag,
        reporter: profile,
      };
    })
  );

  return flagsWithReporter as FlaggedContentWithReporter[];
}

export async function updateFlagStatusAction(
  flagId: string,
  status: FlagStatus
): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: isAdmin } = await supabase.rpc("is_admin");

  if (!isAdmin) {
    throw new Error("Forbidden");
  }

  const { error } = await supabase
    .from("content_flags")
    .update({
      status,
      resolved_at: status !== "pending" ? new Date().toISOString() : null,
    })
    .eq("id", flagId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function getPendingStickerDesignsAction(): Promise<StickerDesignWithProfile[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: isAdmin } = await supabase.rpc("is_admin");

  if (!isAdmin) {
    throw new Error("Forbidden");
  }

  const { data: designs, error } = await supabase
    .from("sticker_designs")
    .select("*")
    .eq("approval_status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const designsWithProfile = await Promise.all(
    designs.map(async (design) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", design.user_id)
        .single();

      return {
        ...design,
        profile,
      };
    })
  );

  return designsWithProfile as StickerDesignWithProfile[];
}

export async function updateStickerApprovalAction(
  designId: string,
  status: ApprovalStatus
): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: isAdmin } = await supabase.rpc("is_admin");

  if (!isAdmin) {
    throw new Error("Forbidden");
  }

  const { error } = await supabase
    .from("sticker_designs")
    .update({
      approval_status: status,
    })
    .eq("id", designId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function createModerationLogAction(
  contentType: ContentType,
  contentId: string,
  action: ModAction,
  reason: string
): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: isAdmin } = await supabase.rpc("is_admin");

  if (!isAdmin) {
    throw new Error("Forbidden");
  }

  const { error } = await supabase.from("moderation_logs").insert({
    admin_id: user.id,
    content_type: contentType,
    content_id: contentId,
    action,
    reason,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function getModerationLogsAction(): Promise<ModerationLogWithAdmin[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: isAdmin } = await supabase.rpc("is_admin");

  if (!isAdmin) {
    throw new Error("Forbidden");
  }

  const { data: logs, error } = await supabase
    .from("moderation_logs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const logsWithAdmin = await Promise.all(
    logs.map(async (log) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", log.admin_id)
        .single();

      return {
        ...log,
        admin: profile,
      };
    })
  );

  return logsWithAdmin as ModerationLogWithAdmin[];
}

export async function removeContentAction(
  contentType: ContentType,
  contentId: string,
  reason: string
): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: isAdmin } = await supabase.rpc("is_admin");

  if (!isAdmin) {
    throw new Error("Forbidden");
  }

  if (contentType === "page") {
    const { error } = await supabase.from("pages").delete().eq("id", contentId);
    if (error) {
      throw new Error(error.message);
    }
  } else if (contentType === "sticker") {
    const { error } = await supabase.from("stickers").delete().eq("id", contentId);
    if (error) {
      throw new Error(error.message);
    }
  } else if (contentType === "element") {
    const { error } = await supabase.from("page_elements").delete().eq("id", contentId);
    if (error) {
      throw new Error(error.message);
    }
  }

  await createModerationLogAction(contentType, contentId, "remove", reason);
}
