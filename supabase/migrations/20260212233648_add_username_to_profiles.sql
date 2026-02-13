ALTER TABLE public.profiles
ADD COLUMN username TEXT UNIQUE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, learned_letters)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'pending_username',
    COALESCE((NEW.raw_user_meta_data->>'pending_learned_letters')::jsonb, '[]'::jsonb)
  );
  RETURN NEW;
END;
$$;
