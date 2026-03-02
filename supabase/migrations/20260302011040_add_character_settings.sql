ALTER TABLE profiles
ADD COLUMN character_settings jsonb DEFAULT '{
  "color": "#6366f1",
  "numPoints": 8,
  "spikeyness": 20,
  "eyeStyle": 0,
  "hat": 0,
  "glasses": 0,
  "makeup": 0,
  "shoes": 0
}'::jsonb NOT NULL;
