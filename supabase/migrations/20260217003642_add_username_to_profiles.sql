ALTER TABLE profiles ADD COLUMN username TEXT UNIQUE;

CREATE UNIQUE INDEX profiles_username_lower_idx ON profiles (LOWER(username));

ALTER TABLE profiles ADD CONSTRAINT username_format CHECK (
  username ~ '^[a-zA-Z0-9_-]{3,20}$'
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, learned_letters, username)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'pending_learned_letters')::jsonb, '[]'::jsonb),
    NEW.raw_user_meta_data->>'username'
  );
  RETURN NEW;
END;
$$;
