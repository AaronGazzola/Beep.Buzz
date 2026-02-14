DROP POLICY IF EXISTS "matches_update_authenticated" ON public.matches;

CREATE POLICY "matches_update_authenticated"
  ON public.matches
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id
    OR (status = 'pending' AND auth.uid() != user_id)
  )
  WITH CHECK (
    auth.uid() = user_id
    OR (status = 'active' AND auth.uid() = opponent_id)
  );
