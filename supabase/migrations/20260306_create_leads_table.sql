-- Create leads table to capture enrollment form submissions
create table public.leads (
  id                   uuid        default gen_random_uuid() primary key,
  created_at           timestamptz default now(),

  -- Personal
  first_name           text,
  last_name            text,
  email                text        not null,
  phone                text,

  -- Property
  street               text,
  city                 text,
  state                text,
  zip                  text,

  -- System
  installed_past_year  text,
  system_type          text,

  -- Maintenance
  maintains_system     text,
  maintenance_frequency text,
  bedrooms             text,
  occupants            text,

  -- Plan
  promo_code           text,
  final_price          numeric     default 499,

  -- UTM tracking
  utm_source           text,
  utm_medium           text,
  utm_campaign         text,
  utm_content          text,

  -- Status: 'submitted' | 'denied_state' | 'denied_cesspool'
  status               text        default 'submitted'
);

-- Enable Row Level Security
alter table public.leads enable row level security;

-- Allow anonymous inserts (public enrollment form — no auth required)
create policy "allow_anon_insert" on public.leads
  for insert
  to anon
  with check (true);

-- Only authenticated users (portal admins) can read leads
create policy "allow_authenticated_read" on public.leads
  for select
  to authenticated
  using (true);
