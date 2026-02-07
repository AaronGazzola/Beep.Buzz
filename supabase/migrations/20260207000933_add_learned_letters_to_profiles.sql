ALTER TABLE profiles
ADD COLUMN learned_letters jsonb DEFAULT '[]'::jsonb;
