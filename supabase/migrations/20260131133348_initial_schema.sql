-- Create user_role enum type
-- Defines application-level roles stored in profiles.role column
-- These are NOT Postgres roles - they are checked in RLS policies using helper functions
CREATE TYPE user_role AS ENUM ('user', 'admin', 'super-admin');

-- Create enum types
CREATE TYPE match_status AS ENUM ('in_progress', 'completed', 'abandoned');
CREATE TYPE leaderboard_category AS ENUM ('encoding_speed', 'decoding_speed', 'overall', 'weekly_challenge');

-- Create tables
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  username TEXT NOT NULL,
  rank INTEGER NOT NULL DEFAULT 0,
  xp INTEGER NOT NULL DEFAULT 0,
  streak_days INTEGER NOT NULL DEFAULT 0,
  last_practice TIMESTAMP WITH TIME ZONE,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  role user_role NOT NULL DEFAULT 'user',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
  UNIQUE (username)
);

CREATE TABLE public.lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  difficulty INTEGER NOT NULL,
  character_set TEXT[] NOT NULL,
  completion_criteria JSONB NOT NULL,
  order_index INTEGER NOT NULL,
  prerequisites UUID[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE public.lesson_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  lesson_id UUID NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  accuracy DECIMAL(5,2),
  wpm DECIMAL(5,2),
  attempts INTEGER NOT NULL DEFAULT 0,
  last_attempt TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
  UNIQUE (user_id, lesson_id)
);

CREATE TABLE public.practice_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  character_set TEXT[] NOT NULL,
  difficulty INTEGER NOT NULL,
  duration_seconds INTEGER NOT NULL,
  accuracy DECIMAL(5,2) NOT NULL,
  wpm DECIMAL(5,2) NOT NULL,
  mistakes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE public.competitive_matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player1_id UUID NOT NULL,
  player2_id UUID NOT NULL,
  challenge_text TEXT NOT NULL,
  status match_status NOT NULL DEFAULT 'in_progress',
  winner_id UUID,
  chat_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE public.match_solutions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID NOT NULL,
  user_id UUID NOT NULL,
  submission TEXT NOT NULL,
  accuracy DECIMAL(5,2) NOT NULL,
  wpm DECIMAL(5,2) NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE public.morse_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  encoded_content TEXT NOT NULL,
  decoded_content TEXT,
  decoded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  criteria JSONB NOT NULL,
  reward_xp INTEGER NOT NULL DEFAULT 0,
  badge_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE (title)
);

CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  achievement_id UUID NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  progress JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, achievement_id)
);

CREATE TABLE public.leaderboard_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  category leaderboard_category NOT NULL,
  score INTEGER NOT NULL,
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT valid_period CHECK (period_end > period_start),
  CONSTRAINT positive_score CHECK (score >= 0)
);

CREATE TABLE public.user_statistics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  avg_encode_wpm DECIMAL(5,2) NOT NULL DEFAULT 0,
  avg_decode_wpm DECIMAL(5,2) NOT NULL DEFAULT 0,
  total_practice_time INTEGER NOT NULL DEFAULT 0,
  matches_won INTEGER NOT NULL DEFAULT 0,
  matches_played INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
  UNIQUE (user_id),
  CONSTRAINT positive_wpm CHECK (avg_encode_wpm >= 0 AND avg_decode_wpm >= 0),
  CONSTRAINT positive_times CHECK (total_practice_time >= 0),
  CONSTRAINT valid_matches CHECK (matches_won <= matches_played)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitive_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.morse_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_statistics ENABLE ROW LEVEL SECURITY;

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
  INSERT INTO public.profiles (id, user_id, rank, xp, streak_days, last_practice, settings, created_at, role)
  VALUES (NEW.id, NEW.id, 0, 0, 0, NULL, '{}'::jsonb, NOW(), 'user');
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

CREATE POLICY "lessons_select_anon"
  ON public.lessons
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "lessons_select_authenticated"
  ON public.lessons
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "lessons_select_admin"
  ON public.lessons
  FOR SELECT
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "lessons_insert_admin"
  ON public.lessons
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "lessons_update_admin"
  ON public.lessons
  FOR UPDATE
  TO authenticated
  USING ((SELECT is_admin()))
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "lessons_delete_admin"
  ON public.lessons
  FOR DELETE
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "lesson_progress_select_anon"
  ON public.lesson_progress
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "lesson_progress_select_authenticated"
  ON public.lesson_progress
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "lesson_progress_select_admin"
  ON public.lesson_progress
  FOR SELECT
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "lesson_progress_insert_authenticated"
  ON public.lesson_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "lesson_progress_insert_admin"
  ON public.lesson_progress
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "lesson_progress_update_authenticated"
  ON public.lesson_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "lesson_progress_update_admin"
  ON public.lesson_progress
  FOR UPDATE
  TO authenticated
  USING ((SELECT is_admin()))
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "lesson_progress_delete_authenticated"
  ON public.lesson_progress
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "lesson_progress_delete_admin"
  ON public.lesson_progress
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

CREATE POLICY "competitive_matches_select_anon"
  ON public.competitive_matches
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "competitive_matches_select_authenticated"
  ON public.competitive_matches
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "competitive_matches_select_admin"
  ON public.competitive_matches
  FOR SELECT
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "competitive_matches_insert_admin"
  ON public.competitive_matches
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "competitive_matches_update_admin"
  ON public.competitive_matches
  FOR UPDATE
  TO authenticated
  USING ((SELECT is_admin()))
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "competitive_matches_delete_admin"
  ON public.competitive_matches
  FOR DELETE
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "match_solutions_select_anon"
  ON public.match_solutions
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "match_solutions_select_authenticated"
  ON public.match_solutions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "match_solutions_select_admin"
  ON public.match_solutions
  FOR SELECT
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "match_solutions_insert_authenticated"
  ON public.match_solutions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "match_solutions_insert_admin"
  ON public.match_solutions
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "match_solutions_update_authenticated"
  ON public.match_solutions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "match_solutions_update_admin"
  ON public.match_solutions
  FOR UPDATE
  TO authenticated
  USING ((SELECT is_admin()))
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "match_solutions_delete_authenticated"
  ON public.match_solutions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "match_solutions_delete_admin"
  ON public.match_solutions
  FOR DELETE
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "morse_messages_select_anon"
  ON public.morse_messages
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "morse_messages_select_authenticated"
  ON public.morse_messages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "morse_messages_select_admin"
  ON public.morse_messages
  FOR SELECT
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "morse_messages_insert_admin"
  ON public.morse_messages
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "morse_messages_update_admin"
  ON public.morse_messages
  FOR UPDATE
  TO authenticated
  USING ((SELECT is_admin()))
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "morse_messages_delete_admin"
  ON public.morse_messages
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

CREATE POLICY "leaderboard_entries_select_anon"
  ON public.leaderboard_entries
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "leaderboard_entries_select_authenticated"
  ON public.leaderboard_entries
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "leaderboard_entries_select_admin"
  ON public.leaderboard_entries
  FOR SELECT
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "leaderboard_entries_insert_authenticated"
  ON public.leaderboard_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "leaderboard_entries_insert_admin"
  ON public.leaderboard_entries
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "leaderboard_entries_update_authenticated"
  ON public.leaderboard_entries
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "leaderboard_entries_update_admin"
  ON public.leaderboard_entries
  FOR UPDATE
  TO authenticated
  USING ((SELECT is_admin()))
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "leaderboard_entries_delete_authenticated"
  ON public.leaderboard_entries
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "leaderboard_entries_delete_admin"
  ON public.leaderboard_entries
  FOR DELETE
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "user_statistics_select_anon"
  ON public.user_statistics
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "user_statistics_select_authenticated"
  ON public.user_statistics
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "user_statistics_select_admin"
  ON public.user_statistics
  FOR SELECT
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "user_statistics_insert_authenticated"
  ON public.user_statistics
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_statistics_insert_admin"
  ON public.user_statistics
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "user_statistics_update_authenticated"
  ON public.user_statistics
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_statistics_update_admin"
  ON public.user_statistics
  FOR UPDATE
  TO authenticated
  USING ((SELECT is_admin()))
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "user_statistics_delete_authenticated"
  ON public.user_statistics
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "user_statistics_delete_admin"
  ON public.user_statistics
  FOR DELETE
  TO authenticated
  USING ((SELECT is_admin()));