# Database

```sql
-- Create user_role enum type
-- Defines application-level roles stored in profiles.role column
-- These are NOT Postgres roles - they are checked in RLS policies using helper functions
CREATE TYPE user_role AS ENUM ('user', 'admin', 'super-admin');

-- Create enum types
CREATE TYPE page_visibility AS ENUM ('public', 'private');
CREATE TYPE element_type AS ENUM ('text', 'shape', 'divider', 'youtube');
CREATE TYPE sticker_type AS ENUM ('beep', 'buzz');
CREATE TYPE content_type AS ENUM ('page', 'sticker', 'element');
CREATE TYPE flag_reason AS ENUM ('inappropriate', 'spam', 'offensive', 'other');
CREATE TYPE flag_status AS ENUM ('pending', 'reviewed', 'dismissed');
CREATE TYPE mod_action AS ENUM ('approve', 'remove', 'warn', 'ban');
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');

-- Create tables
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  username TEXT NOT NULL UNIQUE,
  role user_role NOT NULL DEFAULT 'user',
  beep_settings JSONB DEFAULT '{}',
  buzz_settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT fk_profiles_user_id FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE TABLE public.pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  profile_id UUID NOT NULL,
  title TEXT NOT NULL,
  visibility page_visibility DEFAULT 'public',
  beep_count INTEGER DEFAULT 0,
  buzz_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT fk_pages_user_id FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT fk_pages_profile_id FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

CREATE TABLE public.page_elements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  page_id UUID NOT NULL,
  element_type element_type NOT NULL,
  content JSONB NOT NULL,
  position_x INTEGER NOT NULL,
  position_y INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT fk_page_elements_user_id FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT fk_page_elements_page_id FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
);

CREATE TABLE public.stickers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  page_id UUID NOT NULL,
  sticker_type sticker_type NOT NULL,
  position_x INTEGER NOT NULL,
  position_y INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_stickers_user_id FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT fk_stickers_page_id FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
);

CREATE TABLE public.content_flags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content_type content_type NOT NULL,
  content_id UUID NOT NULL,
  reason flag_reason NOT NULL,
  status flag_status DEFAULT 'pending',
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT fk_content_flags_user_id FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE TABLE public.moderation_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL,
  target_user_id UUID NOT NULL,
  action mod_action NOT NULL,
  content_type content_type,
  content_id UUID,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_moderation_logs_admin_id FOREIGN KEY (admin_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT fk_moderation_logs_target_user_id FOREIGN KEY (target_user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE TABLE public.sticker_designs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  profile_id UUID NOT NULL,
  sticker_type sticker_type NOT NULL,
  config JSONB NOT NULL,
  status approval_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT fk_sticker_designs_user_id FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT fk_sticker_designs_profile_id FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.page_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  page_id UUID NOT NULL,
  category_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_page_categories_user_id FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT fk_page_categories_page_id FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE,
  CONSTRAINT fk_page_categories_category_id FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Create indexes for foreign keys
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_pages_user_id ON public.pages(user_id);
CREATE INDEX idx_pages_profile_id ON public.pages(profile_id);
CREATE INDEX idx_page_elements_user_id ON public.page_elements(user_id);
CREATE INDEX idx_page_elements_page_id ON public.page_elements(page_id);
CREATE INDEX idx_stickers_user_id ON public.stickers(user_id);
CREATE INDEX idx_stickers_page_id ON public.stickers(page_id);
CREATE INDEX idx_content_flags_user_id ON public.content_flags(user_id);
CREATE INDEX idx_moderation_logs_admin_id ON public.moderation_logs(admin_id);
CREATE INDEX idx_moderation_logs_target_user_id ON public.moderation_logs(target_user_id);
CREATE INDEX idx_sticker_designs_user_id ON public.sticker_designs(user_id);
CREATE INDEX idx_sticker_designs_profile_id ON public.sticker_designs(profile_id);
CREATE INDEX idx_page_categories_user_id ON public.page_categories(user_id);
CREATE INDEX idx_page_categories_page_id ON public.page_categories(page_id);
CREATE INDEX idx_page_categories_category_id ON public.page_categories(category_id);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stickers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sticker_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_categories ENABLE ROW LEVEL SECURITY;

-- Create RLS helper function for admin role checks
-- SECURITY DEFINER: Runs with creator's permissions to read profiles
-- STABLE: Enables query-level caching for performance
-- Wrap calls in (SELECT ...) for proper caching: USING ((SELECT is_admin()))

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT (SELECT role FROM public.profiles WHERE user_id = auth.uid()) IN ('admin', 'super-admin');
$$;

-- Create RLS Policies
-- Using native PostgreSQL roles: anon, authenticated
-- Admin policies use authenticated role with is_admin() function check

CREATE POLICY "profiles_select_anon"
  ON public.profiles
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "profiles_select_authenticated"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "profiles_select_admin"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "profiles_insert_authenticated"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "profiles_insert_admin"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "profiles_update_authenticated"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "profiles_update_admin"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING ((SELECT is_admin()))
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "profiles_delete_authenticated"
  ON public.profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "profiles_delete_admin"
  ON public.profiles
  FOR DELETE
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "pages_select_anon"
  ON public.pages
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "pages_select_authenticated"
  ON public.pages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "pages_select_admin"
  ON public.pages
  FOR SELECT
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "pages_insert_authenticated"
  ON public.pages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "pages_insert_admin"
  ON public.pages
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "pages_update_authenticated"
  ON public.pages
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "pages_update_admin"
  ON public.pages
  FOR UPDATE
  TO authenticated
  USING ((SELECT is_admin()))
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "pages_delete_authenticated"
  ON public.pages
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "pages_delete_admin"
  ON public.pages
  FOR DELETE
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "page_elements_select_anon"
  ON public.page_elements
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "page_elements_select_authenticated"
  ON public.page_elements
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "page_elements_select_admin"
  ON public.page_elements
  FOR SELECT
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "page_elements_insert_authenticated"
  ON public.page_elements
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "page_elements_insert_admin"
  ON public.page_elements
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "page_elements_update_authenticated"
  ON public.page_elements
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "page_elements_update_admin"
  ON public.page_elements
  FOR UPDATE
  TO authenticated
  USING ((SELECT is_admin()))
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "page_elements_delete_authenticated"
  ON public.page_elements
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "page_elements_delete_admin"
  ON public.page_elements
  FOR DELETE
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "stickers_select_anon"
  ON public.stickers
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "stickers_select_authenticated"
  ON public.stickers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "stickers_select_admin"
  ON public.stickers
  FOR SELECT
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "stickers_insert_authenticated"
  ON public.stickers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "stickers_insert_admin"
  ON public.stickers
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "stickers_update_authenticated"
  ON public.stickers
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "stickers_update_admin"
  ON public.stickers
  FOR UPDATE
  TO authenticated
  USING ((SELECT is_admin()))
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "stickers_delete_authenticated"
  ON public.stickers
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "stickers_delete_admin"
  ON public.stickers
  FOR DELETE
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "content_flags_select_authenticated"
  ON public.content_flags
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "content_flags_select_admin"
  ON public.content_flags
  FOR SELECT
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "content_flags_insert_authenticated"
  ON public.content_flags
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "content_flags_insert_admin"
  ON public.content_flags
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "content_flags_update_admin"
  ON public.content_flags
  FOR UPDATE
  TO authenticated
  USING ((SELECT is_admin()))
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "content_flags_delete_admin"
  ON public.content_flags
  FOR DELETE
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "moderation_logs_select_admin"
  ON public.moderation_logs
  FOR SELECT
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "moderation_logs_insert_admin"
  ON public.moderation_logs
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "moderation_logs_update_admin"
  ON public.moderation_logs
  FOR UPDATE
  TO authenticated
  USING ((SELECT is_admin()))
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "moderation_logs_delete_admin"
  ON public.moderation_logs
  FOR DELETE
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "sticker_designs_select_authenticated"
  ON public.sticker_designs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "sticker_designs_select_admin"
  ON public.sticker_designs
  FOR SELECT
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "sticker_designs_insert_authenticated"
  ON public.sticker_designs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "sticker_designs_insert_admin"
  ON public.sticker_designs
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "sticker_designs_update_authenticated"
  ON public.sticker_designs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "sticker_designs_update_admin"
  ON public.sticker_designs
  FOR UPDATE
  TO authenticated
  USING ((SELECT is_admin()))
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "sticker_designs_delete_authenticated"
  ON public.sticker_designs
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "sticker_designs_delete_admin"
  ON public.sticker_designs
  FOR DELETE
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "categories_select_anon"
  ON public.categories
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "categories_select_authenticated"
  ON public.categories
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "categories_select_admin"
  ON public.categories
  FOR SELECT
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "categories_insert_admin"
  ON public.categories
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "categories_update_admin"
  ON public.categories
  FOR UPDATE
  TO authenticated
  USING ((SELECT is_admin()))
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "categories_delete_admin"
  ON public.categories
  FOR DELETE
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "page_categories_select_anon"
  ON public.page_categories
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "page_categories_select_authenticated"
  ON public.page_categories
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "page_categories_select_admin"
  ON public.page_categories
  FOR SELECT
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "page_categories_insert_authenticated"
  ON public.page_categories
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "page_categories_insert_admin"
  ON public.page_categories
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "page_categories_update_authenticated"
  ON public.page_categories
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "page_categories_update_admin"
  ON public.page_categories
  FOR UPDATE
  TO authenticated
  USING ((SELECT is_admin()))
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "page_categories_delete_authenticated"
  ON public.page_categories
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "page_categories_delete_admin"
  ON public.page_categories
  FOR DELETE
  TO authenticated
  USING ((SELECT is_admin()));
```
