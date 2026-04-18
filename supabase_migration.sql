-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)
-- Project: ygiahbdxcpolvigwnoxs

create table if not exists public.chats (
  id          text primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null default 'New Chat',
  messages    jsonb not null default '[]',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Index for fast per-user queries
create index if not exists chats_user_id_idx on public.chats(user_id);

-- Enable Row Level Security
alter table public.chats enable row level security;

-- Users can only read/write their own chats
create policy "Users can manage their own chats"
  on public.chats
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
