-- ============================================================
-- TitikRevisi — Supabase SQL Migration
-- Run this in: Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. PROFILES
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  email text,
  university text,
  major text,
  payment_status text check (payment_status in ('pending', 'confirmed', 'rejected')) default null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. PAYMENTS
create table if not exists public.payments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  qris_proof_url text,
  status text check (status in ('pending', 'confirmed', 'rejected')) default 'pending',
  admin_notes text,
  confirmed_at timestamptz,
  created_at timestamptz default now()
);

-- 3. RESOURCES
create table if not exists public.resources (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  type text check (type in ('ebook_prompt', 'ebook_excel', 'ebook_pelajaran', 'template_ppt')) not null,
  link text not null,
  is_active boolean default true,
  order_index integer default 0,
  created_at timestamptz default now()
);

-- 4. SITE SETTINGS
create table if not exists public.site_settings (
  key text primary key,
  value text,
  updated_at timestamptz default now()
);

-- 5. ADMIN PROFILES
create table if not exists public.admin_profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  role text default 'admin'
);

-- ============================================================
-- SEED DEFAULT SITE SETTINGS
-- ============================================================
insert into public.site_settings (key, value) values
  ('qris_image_url', ''),
  ('price_original', '250000'),
  ('price_promo', '69000'),
  ('whatsapp_number', '6281234567890'),
  ('site_open', 'true')
on conflict (key) do nothing;

-- ============================================================
-- TRIGGER: auto-create profile on new user signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- TRIGGER: auto-update updated_at on profiles
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- STORAGE BUCKET for payment proofs
-- ============================================================
insert into storage.buckets (id, name, public)
values ('payment-proofs', 'payment-proofs', false)
on conflict (id) do nothing;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- PROFILES
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admin full access to profiles"
  on public.profiles for all
  using (
    exists (
      select 1 from public.admin_profiles where id = auth.uid()
    )
  );

-- PAYMENTS
alter table public.payments enable row level security;

create policy "Users can insert own payment"
  on public.payments for insert
  with check (auth.uid() = user_id);

create policy "Users can view own payment"
  on public.payments for select
  using (auth.uid() = user_id);

create policy "Admin full access to payments"
  on public.payments for all
  using (
    exists (
      select 1 from public.admin_profiles where id = auth.uid()
    )
  );

-- RESOURCES
alter table public.resources enable row level security;

create policy "Confirmed members can view active resources"
  on public.resources for select
  using (
    is_active = true and
    exists (
      select 1 from public.profiles
      where id = auth.uid() and payment_status = 'confirmed'
    )
  );

create policy "Admin full access to resources"
  on public.resources for all
  using (
    exists (
      select 1 from public.admin_profiles where id = auth.uid()
    )
  );

-- SITE SETTINGS
alter table public.site_settings enable row level security;

create policy "Public can read site settings"
  on public.site_settings for select
  using (true);

create policy "Admin can update site settings"
  on public.site_settings for update
  using (
    exists (
      select 1 from public.admin_profiles where id = auth.uid()
    )
  );

create policy "Admin can insert site settings"
  on public.site_settings for insert
  with check (
    exists (
      select 1 from public.admin_profiles where id = auth.uid()
    )
  );

-- ADMIN PROFILES
alter table public.admin_profiles enable row level security;

create policy "Admin can view own admin profile"
  on public.admin_profiles for select
  using (auth.uid() = id);

-- STORAGE: payment-proofs
create policy "Users can upload own proof"
  on storage.objects for insert
  with check (
    bucket_id = 'payment-proofs' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can view own proof"
  on storage.objects for select
  using (
    bucket_id = 'payment-proofs' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Admin can view all proofs"
  on storage.objects for select
  using (
    bucket_id = 'payment-proofs' and
    exists (
      select 1 from public.admin_profiles where id = auth.uid()
    )
  );
