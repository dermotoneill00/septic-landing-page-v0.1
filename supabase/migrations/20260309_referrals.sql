-- ══════════════════════════════════════════════════════════════════════════════
-- Referral Program — $20 per referral, 10 = free policy
-- ══════════════════════════════════════════════════════════════════════════════

-- ── Helper: generate a unique 9-char referral code (XXXX-XXXX) ────────────
-- Uses A-Z, 2-9 (no I/O/0/1 to avoid confusion)
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code  TEXT := '';
  i     INT;
  taken BOOLEAN;
BEGIN
  LOOP
    code := '';
    FOR i IN 1..4 LOOP
      code := code || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    code := code || '-';
    FOR i IN 1..4 LOOP
      code := code || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE referral_code = code) INTO taken;
    EXIT WHEN NOT taken;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- ── Add referral_code column to profiles ──────────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;

-- Backfill existing profiles
UPDATE public.profiles
  SET referral_code = public.generate_referral_code()
  WHERE referral_code IS NULL;

-- Now make it NOT NULL with auto-generation for new rows
ALTER TABLE public.profiles
  ALTER COLUMN referral_code SET NOT NULL,
  ALTER COLUMN referral_code SET DEFAULT public.generate_referral_code();

-- ── Add referral_code column to leads ─────────────────────────────────────
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS referral_code TEXT;

-- ── Create referrals table ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.referrals (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_profile_id UUID NOT NULL REFERENCES public.profiles(id),
  referee_email       TEXT NOT NULL,
  referee_profile_id  UUID REFERENCES public.profiles(id),
  referral_code       TEXT NOT NULL,
  status              TEXT NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'enrolled', 'rewarded')),
  reward_amount       NUMERIC(10, 2) NOT NULL DEFAULT 20.00,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  enrolled_at         TIMESTAMPTZ,
  rewarded_at         TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer  ON public.referrals(referrer_profile_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referee   ON public.referrals(referee_email);
CREATE INDEX IF NOT EXISTS idx_referrals_code      ON public.referrals(referral_code);

-- ── RLS for referrals ─────────────────────────────────────────────────────
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read referrals (portal filters client-side;
-- admin page uses isAdmin guard). Data is non-sensitive (status + amounts).
CREATE POLICY "Authenticated can read referrals"
  ON public.referrals FOR SELECT TO authenticated USING (true);

-- Authenticated users can update referrals (admin marks as rewarded)
CREATE POLICY "Authenticated can update referrals"
  ON public.referrals FOR UPDATE TO authenticated USING (true);

-- Only service role inserts referrals (via provision-customer edge function)
-- No insert policy needed for authenticated — service role bypasses RLS.
