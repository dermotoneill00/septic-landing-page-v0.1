-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 001: Core schema
-- Run this in the Supabase SQL editor or via `supabase db push`
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable the pgcrypto extension for gen_random_uuid()
create extension if not exists "pgcrypto";

-- ── profiles ──────────────────────────────────────────────────────────────────
-- One row per customer who has portal access.
-- auth_user_id links to Supabase Auth's auth.users table.
-- portal_enabled controls whether the user is allowed to see policy data.
-- must_reset_password forces a password change on first login.

create table if not exists profiles (
  id                   uuid        primary key default gen_random_uuid(),
  auth_user_id         uuid        unique references auth.users(id) on delete cascade,
  email                text        unique not null,
  first_name           text,
  last_name            text,
  phone                text,
  portal_enabled       boolean     not null default false,
  must_reset_password  boolean     not null default true,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

-- ── policies ──────────────────────────────────────────────────────────────────
-- All policy records for a customer, including inactive history.
-- profile_id links to profiles(id). raw_import_json stores the original CSV row
-- for audit / debugging purposes.

create table if not exists policies (
  id                      uuid        primary key default gen_random_uuid(),
  profile_id              uuid        references profiles(id) on delete cascade,
  source_record_id        text,
  policy_number           text        not null unique,
  status                  text        not null,
  product_type            text,
  product                 text,
  start_date              date,
  expiration_date         date,
  coverage_effective_date date,
  policy_sort_date        date,
  street                  text,
  city                    text,
  state                   text,
  zip                     text,
  full_address            text,
  home_phone              text,
  cell                    text,
  raw_import_json         jsonb,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

-- ── import_review_flags ───────────────────────────────────────────────────────
-- Rows that could not be cleanly imported. Reviewed manually after each import.
-- No RLS policies are defined for this table — only service-role access.

create table if not exists import_review_flags (
  id                    uuid        primary key default gen_random_uuid(),
  source_row_identifier text,
  issue_type            text        not null,
  notes                 text,
  raw_row_json          jsonb,
  created_at            timestamptz not null default now()
);

-- ── Indexes ───────────────────────────────────────────────────────────────────

create index if not exists idx_profiles_auth_user_id
  on profiles(auth_user_id);

create index if not exists idx_profiles_email
  on profiles(email);

create index if not exists idx_policies_profile_id
  on policies(profile_id);

create index if not exists idx_policies_status
  on policies(status);

create index if not exists idx_policies_policy_number
  on policies(policy_number);

-- Most-recent policy first for dashboard queries
create index if not exists idx_policies_sort_date_desc
  on policies(policy_sort_date desc nulls last);

-- ── updated_at trigger ────────────────────────────────────────────────────────

create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at_column();

create trigger policies_updated_at
  before update on policies
  for each row execute function update_updated_at_column();
