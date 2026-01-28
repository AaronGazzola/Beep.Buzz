import type { Page, PageElement, Sticker, Profile } from "../layout.types";

export type PageWithElements = Page & {
  page_elements: PageElement[];
  stickers: Sticker[];
};

export type ProfilePageData = {
  profile: Profile;
  page: PageWithElements | null;
};
