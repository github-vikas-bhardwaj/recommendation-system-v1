-- Custom session auth (not Supabase Auth): users + hashed session tokens

create table if not exists public.users (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  password_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint users_email_unique unique (email)
);

create table if not exists public.sessions (
  id bigint generated always as identity primary key,
  token_hash text not null,
  user_id bigint not null references public.users (id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  last_used_at timestamptz not null default now(),
  constraint sessions_token_hash_unique unique (token_hash)
);

create index if not exists sessions_user_id_idx on public.sessions (user_id);
create index if not exists sessions_expires_at_idx on public.sessions (expires_at);

alter table public.users enable row level security;
alter table public.sessions enable row level security;

-- No anon/authenticated policies: app uses service role from server actions only
