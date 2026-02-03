# Database

```sql
-- Create user_role enum type
-- Defines application-level roles stored in profiles.role column
-- These are NOT Postgres roles - they are checked in RLS policies using helper functions
CREATE TYPE user_role AS ENUM ('user', 'admin', 'super-admin');

-- Create enum types
CREATE TYPE match_status AS ENUM ('pending', 'active', 'completed', 'cancelled');
CREATE TYPE practice_type AS ENUM ('translation', 'morse_input');
CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE achievement_type AS ENUM ('skill', 'progress', 'special');
CREATE TYPE message_status AS ENUM ('pending', 'reviewed', 'resolved');
CREATE TYPE ranking_category AS ENUM ('accuracy', 'speed', 'wins', 'experience');

-- Create tables
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role user_role NOT NULL DEFAULT 'user',
  level INTEGER NOT NULL DEFAULT 1,
  experience_points INTEGER NOT NULL DEFAULT 0,
  skill_rating INTEGER NOT NULL DEFAULT 1000,
  audio_settings JSONB NOT NULL DEFAULT '{"volume": 1.0, "effects": true}'::jsonb,
  visual_settings JSONB NOT NULL DEFAULT '{"theme": "light"}'::jsonb,
  notification_preferences JSONB NOT NULL DEFAULT '{"email": true, "push": true}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE (user_id)
);

CREATE TABLE public.matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  opponent_id UUID NOT NULL,
  status match_status NOT NULL,
  user_score INTEGER NOT NULL DEFAULT 0,
  opponent_score INTEGER NOT NULL DEFAULT 0,
  completion_time INTEGER,
  accuracy DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE public.match_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID NOT NULL,
  user_id UUID NOT NULL,
  message TEXT NOT NULL,
  morse_code TEXT NOT NULL,
  translation_time INTEGER,
  is_correct BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE public.practice_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  exercise_type practice_type NOT NULL,
  difficulty difficulty_level NOT NULL,
  completion_time INTEGER,
  accuracy DECIMAL(5,2),
  words_attempted INTEGER,
  words_correct INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE public.training_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  lesson_id INTEGER NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  accuracy DECIMAL(5,2),
  completion_time INTEGER,
  attempts INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type achievement_type NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  requirements JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  achievement_id UUID NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  progress JSONB,
  UNIQUE (user_id, achievement_id)
);

CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status message_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE TABLE public.leaderboard_rankings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  category ranking_category NOT NULL,
  score DECIMAL(10,2) NOT NULL,
  rank INTEGER,
  last_calculated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, category)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard_rankings ENABLE ROW LEVEL SECURITY;

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

-- Create trigger function for automatic profile creation
-- Automatically creates a profile when a user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

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

CREATE POLICY "matches_select_anon"
  ON public.matches
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "matches_select_authenticated"
  ON public.matches
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "matches_select_admin"
  ON public.matches
  FOR SELECT
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "matches_insert_authenticated"
  ON public.matches
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "matches_insert_admin"
  ON public.matches
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "matches_update_authenticated"
  ON public.matches
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "matches_update_admin"
  ON public.matches
  FOR UPDATE
  TO authenticated
  USING ((SELECT is_admin()))
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "matches_delete_authenticated"
  ON public.matches
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "matches_delete_admin"
  ON public.matches
  FOR DELETE
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "match_messages_select_anon"
  ON public.match_messages
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "match_messages_select_authenticated"
  ON public.match_messages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "match_messages_select_admin"
  ON public.match_messages
  FOR SELECT
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "match_messages_insert_authenticated"
  ON public.match_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "match_messages_insert_admin"
  ON public.match_messages
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "match_messages_update_authenticated"
  ON public.match_messages
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "match_messages_update_admin"
  ON public.match_messages
  FOR UPDATE
  TO authenticated
  USING ((SELECT is_admin()))
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "match_messages_delete_authenticated"
  ON public.match_messages
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "match_messages_delete_admin"
  ON public.match_messages
  FOR DELETE
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "practice_sessions_select_anon"
  ON public.practice_sessions
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "practice_sessions_select_authenticated"
  ON public.practice_sessions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "practice_sessions_select_admin"
  ON public.practice_sessions
  FOR SELECT
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "practice_sessions_insert_authenticated"
  ON public.practice_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "practice_sessions_insert_admin"
  ON public.practice_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "practice_sessions_update_authenticated"
  ON public.practice_sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "practice_sessions_update_admin"
  ON public.practice_sessions
  FOR UPDATE
  TO authenticated
  USING ((SELECT is_admin()))
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "practice_sessions_delete_authenticated"
  ON public.practice_sessions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "practice_sessions_delete_admin"
  ON public.practice_sessions
  FOR DELETE
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "training_progress_select_anon"
  ON public.training_progress
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "training_progress_select_authenticated"
  ON public.training_progress
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "training_progress_select_admin"
  ON public.training_progress
  FOR SELECT
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "training_progress_insert_authenticated"
  ON public.training_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "training_progress_insert_admin"
  ON public.training_progress
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "training_progress_update_authenticated"
  ON public.training_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "training_progress_update_admin"
  ON public.training_progress
  FOR UPDATE
  TO authenticated
  USING ((SELECT is_admin()))
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "training_progress_delete_authenticated"
  ON public.training_progress
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "training_progress_delete_admin"
  ON public.training_progress
  FOR DELETE
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "achievements_select_anon"
  ON public.achievements
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "achievements_select_authenticated"
  ON public.achievements
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "achievements_select_admin"
  ON public.achievements
  FOR SELECT
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "achievements_insert_admin"
  ON public.achievements
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "achievements_update_admin"
  ON public.achievements
  FOR UPDATE
  TO authenticated
  USING ((SELECT is_admin()))
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "achievements_delete_admin"
  ON public.achievements
  FOR DELETE
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "user_achievements_select_anon"
  ON public.user_achievements
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "user_achievements_select_authenticated"
  ON public.user_achievements
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "user_achievements_select_admin"
  ON public.user_achievements
  FOR SELECT
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "user_achievements_insert_authenticated"
  ON public.user_achievements
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_achievements_insert_admin"
  ON public.user_achievements
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "user_achievements_update_authenticated"
  ON public.user_achievements
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_achievements_update_admin"
  ON public.user_achievements
  FOR UPDATE
  TO authenticated
  USING ((SELECT is_admin()))
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "user_achievements_delete_authenticated"
  ON public.user_achievements
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "user_achievements_delete_admin"
  ON public.user_achievements
  FOR DELETE
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "contact_messages_select_anon"
  ON public.contact_messages
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "contact_messages_select_authenticated"
  ON public.contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "contact_messages_select_admin"
  ON public.contact_messages
  FOR SELECT
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "contact_messages_insert_authenticated"
  ON public.contact_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "contact_messages_insert_admin"
  ON public.contact_messages
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "contact_messages_update_authenticated"
  ON public.contact_messages
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "contact_messages_update_admin"
  ON public.contact_messages
  FOR UPDATE
  TO authenticated
  USING ((SELECT is_admin()))
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "contact_messages_delete_authenticated"
  ON public.contact_messages
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "contact_messages_delete_admin"
  ON public.contact_messages
  FOR DELETE
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "leaderboard_rankings_select_anon"
  ON public.leaderboard_rankings
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "leaderboard_rankings_select_authenticated"
  ON public.leaderboard_rankings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "leaderboard_rankings_select_admin"
  ON public.leaderboard_rankings
  FOR SELECT
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "leaderboard_rankings_insert_authenticated"
  ON public.leaderboard_rankings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "leaderboard_rankings_insert_admin"
  ON public.leaderboard_rankings
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "leaderboard_rankings_update_authenticated"
  ON public.leaderboard_rankings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "leaderboard_rankings_update_admin"
  ON public.leaderboard_rankings
  FOR UPDATE
  TO authenticated
  USING ((SELECT is_admin()))
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "leaderboard_rankings_delete_authenticated"
  ON public.leaderboard_rankings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "leaderboard_rankings_delete_admin"
  ON public.leaderboard_rankings
  FOR DELETE
  TO authenticated
  USING ((SELECT is_admin()));
```
