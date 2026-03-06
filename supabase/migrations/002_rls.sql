-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 002: Row Level Security
-- Run after 001_schema.sql
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Enable RLS on all tables ──────────────────────────────────────────────────

alter table profiles            enable row level security;
alter table policies            enable row level security;
alter table import_review_flags enable row level security;

-- ── profiles ──────────────────────────────────────────────────────────────────
-- A signed-in user may only select their own profile row.
-- Write operations (insert/update) are reserved for the service role (imports/admin).

create policy "profiles: users read own row"
  on profiles
  for select
  using (auth.uid() = auth_user_id);

-- Allow the authenticated user to update their own profile.
-- The import script uses service role and bypasses RLS.
create policy "profiles: users update own row"
  on profiles
  for update
  using (auth.uid() = auth_user_id);

-- ── policies ──────────────────────────────────────────────────────────────────
-- A signed-in user may only select policies that belong to their own profile
-- AND only when their profile has portal_enabled = true.
-- This enforces the business rule in the database layer, not just the UI.

create policy "policies: portal-enabled users read own policies"
  on policies
  for select
  using (
    exists (
      select 1
      from   profiles
      where  profiles.id              = policies.profile_id
        and  profiles.auth_user_id    = auth.uid()
        and  profiles.portal_enabled  = true
    )
  );

-- ── import_review_flags ───────────────────────────────────────────────────────
-- No authenticated-user policies. With RLS enabled and no policies defined,
-- authenticated users cannot read, write, or delete any flags.
-- Only the service role (used by the import script) can access this table.

-- (intentionally no policies for authenticated users on this table)
