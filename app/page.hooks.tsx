"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchFeaturedSectionsAction } from "./page.actions";

export function useFeaturedSections() {
  return useQuery({
    queryKey: ["featuredSections"],
    queryFn: fetchFeaturedSectionsAction,
  });
}
