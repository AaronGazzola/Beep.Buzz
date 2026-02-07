CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, learned_letters)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'pending_learned_letters')::jsonb, '[]'::jsonb)
  );
  RETURN NEW;
END;
$$;
