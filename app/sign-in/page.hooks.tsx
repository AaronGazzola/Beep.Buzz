"use client";

import { useMutation } from "@tanstack/react-query";
import { sendMagicLinkAction } from "./page.actions";
import type { MagicLinkData } from "./page.types";

export function useMagicLink() {
  return useMutation({
    mutationFn: (data: MagicLinkData) => sendMagicLinkAction(data),
  });
}
