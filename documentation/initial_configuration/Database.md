# Database

```sql
-- Create user_role enum type
-- Defines application-level roles stored in profiles.role column
-- These are NOT Postgres roles - they are checked in RLS policies using helper functions
CREATE TYPE user_role AS ENUM ('user', 'admin', 'super-admin');

-- Create enum types
CREATE TYPE rank_level AS ENUM ('beginner', 'novice', 'intermediate', 'advanced', 'expert', 'master');
CREATE TYPE lesson_difficulty AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE lesson_status AS ENUM ('not_started', 'in_progress', 'completed');
CREATE TYPE practice_difficulty AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE match_status AS ENUM ('pending', 'active', 'completed', 'cancelled');
CREATE TYPE message_status AS ENUM ('sent', 'received', 'decoded');
CREATE TYPE leaderboard_category AS ENUM ('encoding_speed', 'decoding_accuracy', 'overall');

-- Create tables
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  username TEXT NOT NULL,
  rank rank_level NOT NULL DEFAULT 'beginner',
  xp_points INTEGER NOT NULL DEFAULT 0,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  avatar_url TEXT,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  UNIQUE (user_id),
  UNIQUE (username)
);

CREATE TABLE public.lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty lesson_difficulty NOT NULL,
  character_set TEXT[] NOT NULL,
  content JSONB NOT NULL,
  min_wpm INTEGER NOT NULL,
  min_accuracy DECIMAL NOT NULL,
  prerequisites UUID[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE public.lesson_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  profile_id UUID NOT NULL,
  lesson_id UUID NOT NULL,
  status lesson_status NOT NULL DEFAULT 'in_progress',
  attempts INTEGER NOT NULL DEFAULT 0,
  best_wpm DECIMAL,
  best_accuracy DECIMAL,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE public.practice_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  profile_id UUID NOT NULL,
  character_set TEXT[] NOT NULL,
  difficulty practice_difficulty NOT NULL,
  wpm DECIMAL NOT NULL,
  accuracy DECIMAL NOT NULL,
  duration INTEGER NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.competitive_matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_text TEXT NOT NULL,
  status match_status NOT NULL DEFAULT 'pending',
  player1_id UUID,
  player2_id UUID,
  winner_id UUID,
  chat_log JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE public.match_solutions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID NOT NULL,
  user_id UUID NOT NULL,
  submission TEXT NOT NULL,
  wpm DECIMAL NOT NULL,
  accuracy DECIMAL NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.morse_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  encoded_message TEXT NOT NULL,
  decoded_message TEXT,
  status message_status DEFAULT 'sent',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  decoded_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  criteria JSONB NOT NULL,
  badge_url TEXT,
  xp_reward INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (title)
);

CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  profile_id UUID NOT NULL,
  achievement_id UUID NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, achievement_id)
);

CREATE TABLE public.leaderboard_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  profile_id UUID NOT NULL,
  category leaderboard_category NOT NULL,
  score DECIMAL NOT NULL,
  period TEXT NOT NULL,
  rank INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, category, period)
);

CREATE TABLE public.user_statistics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  profile_id UUID NOT NULL,
  avg_wpm DECIMAL NOT NULL DEFAULT 0,
  max_wpm DECIMAL NOT NULL DEFAULT 0,
  accuracy_rate DECIMAL NOT NULL DEFAULT 0,
  practice_time INTEGER NOT NULL DEFAULT 0,
  matches_won INTEGER NOT NULL DEFAULT 0,
  matches_played INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE (user_id)
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
  INSERT INTO public.profiles (id, user_id, rank, xp_points, current_streak, longest_streak, avatar_url, settings, created_at, updated_at)
  VALUES (NEW.id, NEW.id, 'beginner', 0, 0, 0, NULL, '{}'::jsonb, NOW(), NULL);
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
```
