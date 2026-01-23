# Database

```sql
-- Create user_role enum type
-- Defines application-level roles stored in profiles.role column
-- These are NOT Postgres roles - they are checked in RLS policies using helper functions
CREATE TYPE user_role AS ENUM ('user', 'admin', 'super-admin');

-- Create enum types
CREATE TYPE content_status AS ENUM ('ACTIVE', 'FLAGGED', 'REMOVED');
CREATE TYPE element_type AS ENUM ('TEXT', 'SHAPE', 'DIVIDER', 'YOUTUBE');

-- Create tables
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  username TEXT NOT NULL UNIQUE,
  beep_style JSONB NOT NULL,
  buzz_style JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  role user_role NOT NULL DEFAULT 'user',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_profiles_user_id FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT username_length CHECK (LENGTH(username) >= 3 AND LENGTH(username) <= 20)
);

CREATE TABLE public.pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  status content_status NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_pages_profile_id FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
  CONSTRAINT fk_pages_user_id FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE TABLE public.page_elements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID NOT NULL,
  user_id UUID NOT NULL,
  element_type element_type NOT NULL,
  content JSONB NOT NULL,
  position JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_page_elements_page_id FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE,
  CONSTRAINT fk_page_elements_user_id FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE TABLE public.stickers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID NOT NULL,
  profile_id UUID NOT NULL,
  user_id UUID NOT NULL,
  is_buzz BOOLEAN NOT NULL,
  position JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_stickers_page_id FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE,
  CONSTRAINT fk_stickers_profile_id FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
  CONSTRAINT fk_stickers_user_id FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE TABLE public.flagged_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID NOT NULL,
  reporter_id UUID NOT NULL,
  user_id UUID NOT NULL,
  reason TEXT NOT NULL,
  ai_analysis JSONB NOT NULL,
  status content_status NOT NULL DEFAULT 'FLAGGED',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_flagged_content_page_id FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE,
  CONSTRAINT fk_flagged_content_reporter_id FOREIGN KEY (reporter_id) REFERENCES profiles(id) ON DELETE CASCADE,
  CONSTRAINT fk_flagged_content_user_id FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes for foreign keys
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_pages_profile_id ON public.pages(profile_id);
CREATE INDEX idx_pages_user_id ON public.pages(user_id);
CREATE INDEX idx_page_elements_page_id ON public.page_elements(page_id);
CREATE INDEX idx_page_elements_user_id ON public.page_elements(user_id);
CREATE INDEX idx_stickers_page_id ON public.stickers(page_id);
CREATE INDEX idx_stickers_profile_id ON public.stickers(profile_id);
CREATE INDEX idx_stickers_user_id ON public.stickers(user_id);
CREATE INDEX idx_flagged_content_page_id ON public.flagged_content(page_id);
CREATE INDEX idx_flagged_content_reporter_id ON public.flagged_content(reporter_id);
CREATE INDEX idx_flagged_content_user_id ON public.flagged_content(user_id);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stickers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flagged_content ENABLE ROW LEVEL SECURITY;

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

CREATE POLICY "flagged_content_select_authenticated"
  ON public.flagged_content
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "flagged_content_select_admin"
  ON public.flagged_content
  FOR SELECT
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "flagged_content_insert_authenticated"
  ON public.flagged_content
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "flagged_content_insert_admin"
  ON public.flagged_content
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "flagged_content_update_admin"
  ON public.flagged_content
  FOR UPDATE
  TO authenticated
  USING ((SELECT is_admin()))
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "flagged_content_delete_admin"
  ON public.flagged_content
  FOR DELETE
  TO authenticated
  USING ((SELECT is_admin()));
```
