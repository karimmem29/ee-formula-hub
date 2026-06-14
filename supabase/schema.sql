-- ============================================================================
-- EE Formula Hub — Supabase schema
-- ----------------------------------------------------------------------------
-- Run this once in your Supabase project:
--   Dashboard → SQL Editor → New query → paste this file → Run.
--
-- It creates a `profiles` table (one row per auth user) that holds Pro
-- subscription state, wires up Row Level Security, and auto-creates a profile
-- row whenever a new user signs up.
-- ============================================================================

-- One profile per auth user. Pro state lives here.
create table if not exists public.profiles (
  id                  uuid        primary key references auth.users (id) on delete cascade,
  email               text,
  is_pro              boolean     not null default false,
  -- free | on_trial | active | paid | past_due | cancelled | expired | unpaid
  subscription_status text        not null default 'free',
  ls_subscription_id  text,        -- Lemon Squeezy subscription id
  ls_customer_id      text,        -- Lemon Squeezy customer id
  current_period_end  timestamptz, -- when the current paid period ends / renews
  created_at          timestamptz  not null default now(),
  updated_at          timestamptz  not null default now()
);

-- ----------------------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------------------
alter table public.profiles enable row level security;

-- A logged-in user may READ only their own profile.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

-- NOTE: there is intentionally NO insert/update policy for normal users.
-- If users could UPDATE their own row they could set is_pro = true from the
-- browser and grant themselves Pro for free. The flag is written only by the
-- Lemon Squeezy webhook, which uses the service-role key and bypasses RLS.

-- ----------------------------------------------------------------------------
-- Auto-create a profile row on signup
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- Keep updated_at fresh on every change
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Backfill: create profiles for any users that already exist
-- ----------------------------------------------------------------------------
insert into public.profiles (id, email)
select id, email from auth.users
on conflict (id) do nothing;
