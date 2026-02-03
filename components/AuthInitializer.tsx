"use client";

import { useAuth } from "@/app/layout.hooks";
import { useEffect } from "react";

export function AuthInitializer() {
  const { data: user } = useAuth();

  useEffect(() => {
    if (user) {
    }
  }, [user]);

  return null;
}
