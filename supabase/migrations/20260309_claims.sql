-- Claims table: tracks every claim filed by a customer.
-- Linked to profiles and policies. Admin can update status via the portal.

CREATE TABLE IF NOT EXISTS claims (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id     UUID        REFERENCES profiles(id) ON DELETE SET NULL,
  policy_id      UUID        REFERENCES policies(id) ON DELETE SET NULL,
  claim_number   TEXT        UNIQUE,
  status         TEXT        NOT NULL DEFAULT 'submitted',
  -- status values: submitted | in_review | resolved | denied
  description    TEXT,
  internal_notes TEXT,
  created_at     TIMESTAMPTZ DEFAULT now(),
  resolved_at    TIMESTAMPTZ,
  updated_at     TIMESTAMPTZ DEFAULT now()
);

-- Auto-update updated_at on every write
CREATE OR REPLACE FUNCTION update_claims_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER claims_updated_at
  BEFORE UPDATE ON claims
  FOR EACH ROW EXECUTE FUNCTION update_claims_updated_at();

-- RLS: only admins can read/write all claims;
-- customers can read their own claims via their profile_id
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access on claims"
  ON claims FOR ALL
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Customer read own claims"
  ON claims FOR SELECT
  USING (
    profile_id IN (
      SELECT id FROM profiles WHERE auth_user_id = auth.uid()
    )
  );
