create table if not exists public.user_activity (
  id uuid primary key default gen_random_uuid(),
  user_identifier text not null unique,
  saved_item_ids text[] not null default '{}',
  applied_opportunity_ids text[] not null default '{}',
  live_mentorship_requests integer not null default 3,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.user_activity enable row level security;

drop policy if exists "Public read/write for MVP" on public.user_activity;
create policy "Public read/write for MVP"
on public.user_activity
for all
using (true)
with check (true);
