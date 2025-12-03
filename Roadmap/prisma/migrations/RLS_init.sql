-- Enable Row Level Security on all tables

ALTER TABLE public.CreatorProfile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.PageComponent ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.Donation ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Policies for public.CreatorProfile
CREATE POLICY "CreatorProfile_select_user"
  ON public.CreatorProfile
  FOR SELECT
  TO user
  USING (auth.uid() = userId);

CREATE POLICY "CreatorProfile_select_admin"
  ON public.CreatorProfile
  FOR SELECT
  TO admin
  USING (true);

CREATE POLICY "CreatorProfile_select_super_admin"
  ON public.CreatorProfile
  FOR SELECT
  TO super_admin
  USING (true);

CREATE POLICY "CreatorProfile_insert_user"
  ON public.CreatorProfile
  FOR INSERT
  TO user
  USING (auth.uid() = userId);

CREATE POLICY "CreatorProfile_insert_admin"
  ON public.CreatorProfile
  FOR INSERT
  TO admin
  USING (false);

CREATE POLICY "CreatorProfile_insert_super_admin"
  ON public.CreatorProfile
  FOR INSERT
  TO super_admin
  USING (true);

CREATE POLICY "CreatorProfile_update_user"
  ON public.CreatorProfile
  FOR UPDATE
  TO user
  USING (auth.uid() = userId);

CREATE POLICY "CreatorProfile_update_admin"
  ON public.CreatorProfile
  FOR UPDATE
  TO admin
  USING (true);

CREATE POLICY "CreatorProfile_update_super_admin"
  ON public.CreatorProfile
  FOR UPDATE
  TO super_admin
  USING (true);

CREATE POLICY "CreatorProfile_delete_user"
  ON public.CreatorProfile
  FOR DELETE
  TO user
  USING (auth.uid() = userId);

CREATE POLICY "CreatorProfile_delete_admin"
  ON public.CreatorProfile
  FOR DELETE
  TO admin
  USING (true);

CREATE POLICY "CreatorProfile_delete_super_admin"
  ON public.CreatorProfile
  FOR DELETE
  TO super_admin
  USING (true);

-- Policies for public.PageComponent
CREATE POLICY "PageComponent_select_user"
  ON public.PageComponent
  FOR SELECT
  TO user
  USING (auth.uid() = user_id);

CREATE POLICY "PageComponent_select_admin"
  ON public.PageComponent
  FOR SELECT
  TO admin
  USING (true);

CREATE POLICY "PageComponent_select_super_admin"
  ON public.PageComponent
  FOR SELECT
  TO super_admin
  USING (true);

CREATE POLICY "PageComponent_insert_user"
  ON public.PageComponent
  FOR INSERT
  TO user
  USING (auth.uid() = user_id);

CREATE POLICY "PageComponent_insert_admin"
  ON public.PageComponent
  FOR INSERT
  TO admin
  USING (false);

CREATE POLICY "PageComponent_insert_super_admin"
  ON public.PageComponent
  FOR INSERT
  TO super_admin
  USING (true);

CREATE POLICY "PageComponent_update_user"
  ON public.PageComponent
  FOR UPDATE
  TO user
  USING (auth.uid() = user_id);

CREATE POLICY "PageComponent_update_admin"
  ON public.PageComponent
  FOR UPDATE
  TO admin
  USING (true);

CREATE POLICY "PageComponent_update_super_admin"
  ON public.PageComponent
  FOR UPDATE
  TO super_admin
  USING (true);

CREATE POLICY "PageComponent_delete_user"
  ON public.PageComponent
  FOR DELETE
  TO user
  USING (auth.uid() = user_id);

CREATE POLICY "PageComponent_delete_admin"
  ON public.PageComponent
  FOR DELETE
  TO admin
  USING (true);

CREATE POLICY "PageComponent_delete_super_admin"
  ON public.PageComponent
  FOR DELETE
  TO super_admin
  USING (true);

-- Policies for public.Donation
CREATE POLICY "Donation_select_user"
  ON public.Donation
  FOR SELECT
  TO user
  USING (auth.uid() = user_id);

CREATE POLICY "Donation_select_admin"
  ON public.Donation
  FOR SELECT
  TO admin
  USING (true);

CREATE POLICY "Donation_select_super_admin"
  ON public.Donation
  FOR SELECT
  TO super_admin
  USING (true);

CREATE POLICY "Donation_insert_user"
  ON public.Donation
  FOR INSERT
  TO user
  USING (true);

CREATE POLICY "Donation_insert_admin"
  ON public.Donation
  FOR INSERT
  TO admin
  USING (true);

CREATE POLICY "Donation_insert_super_admin"
  ON public.Donation
  FOR INSERT
  TO super_admin
  USING (true);

CREATE POLICY "Donation_update_user"
  ON public.Donation
  FOR UPDATE
  TO user
  USING (auth.uid() = user_id);

CREATE POLICY "Donation_update_admin"
  ON public.Donation
  FOR UPDATE
  TO admin
  USING (true);

CREATE POLICY "Donation_update_super_admin"
  ON public.Donation
  FOR UPDATE
  TO super_admin
  USING (true);

CREATE POLICY "Donation_delete_user"
  ON public.Donation
  FOR DELETE
  TO user
  USING (false);

CREATE POLICY "Donation_delete_admin"
  ON public.Donation
  FOR DELETE
  TO admin
  USING (true);

CREATE POLICY "Donation_delete_super_admin"
  ON public.Donation
  FOR DELETE
  TO super_admin
  USING (true);