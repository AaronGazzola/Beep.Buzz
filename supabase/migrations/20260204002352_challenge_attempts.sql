-- Create enum for game mode
CREATE TYPE game_mode AS ENUM ('training', 'practice');

-- Create enum for challenge type (what was presented)
CREATE TYPE challenge_type AS ENUM ('letter', 'word', 'sentence');

-- Create enum for practice direction
CREATE TYPE practice_direction AS ENUM ('text_to_morse', 'morse_to_text');

-- Create table for training/practice sessions
CREATE TABLE public.game_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  mode game_mode NOT NULL,
  practice_direction practice_direction,
  difficulty challenge_type NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  total_challenges INTEGER NOT NULL DEFAULT 0,
  correct_challenges INTEGER NOT NULL DEFAULT 0,
  final_score INTEGER NOT NULL DEFAULT 0,
  max_streak INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create table for individual challenge attempts
CREATE TABLE public.challenge_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.game_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  challenge_text TEXT NOT NULL,
  expected_morse TEXT NOT NULL,
  user_input TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  challenge_type challenge_type NOT NULL,
  attempt_number INTEGER NOT NULL,
  response_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_game_sessions_user_id ON public.game_sessions(user_id);
CREATE INDEX idx_game_sessions_mode ON public.game_sessions(mode);
CREATE INDEX idx_game_sessions_created_at ON public.game_sessions(created_at DESC);
CREATE INDEX idx_challenge_attempts_session_id ON public.challenge_attempts(session_id);
CREATE INDEX idx_challenge_attempts_user_id ON public.challenge_attempts(user_id);
CREATE INDEX idx_challenge_attempts_is_correct ON public.challenge_attempts(is_correct);

-- Enable Row Level Security
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_attempts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for game_sessions
CREATE POLICY "game_sessions_select_own"
  ON public.game_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "game_sessions_select_admin"
  ON public.game_sessions
  FOR SELECT
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "game_sessions_insert_authenticated"
  ON public.game_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "game_sessions_update_own"
  ON public.game_sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "game_sessions_delete_own"
  ON public.game_sessions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "game_sessions_delete_admin"
  ON public.game_sessions
  FOR DELETE
  TO authenticated
  USING ((SELECT is_admin()));

-- RLS Policies for challenge_attempts
CREATE POLICY "challenge_attempts_select_own"
  ON public.challenge_attempts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "challenge_attempts_select_admin"
  ON public.challenge_attempts
  FOR SELECT
  TO authenticated
  USING ((SELECT is_admin()));

CREATE POLICY "challenge_attempts_insert_authenticated"
  ON public.challenge_attempts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "challenge_attempts_delete_own"
  ON public.challenge_attempts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "challenge_attempts_delete_admin"
  ON public.challenge_attempts
  FOR DELETE
  TO authenticated
  USING ((SELECT is_admin()));
