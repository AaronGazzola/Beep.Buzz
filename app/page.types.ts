import type { Page, Profile, Category } from "./layout.types";

export type PageWithProfile = Page & {
  profiles: Profile;
};

export type FeaturedPage = PageWithProfile;

export type SearchFilters = {
  query: string;
  categoryId: string | null;
};
