-- Per-user watchlist (custom session auth; accessed via service role from server)

create table if not exists public.user_watched_shows (
  user_id bigint not null references public.users (id) on delete cascade,
  show_id integer not null references public.shows (id) on delete cascade,
  watched_at timestamptz not null default now(),
  primary key (user_id, show_id)
);

create index if not exists user_watched_shows_show_id_idx
  on public.user_watched_shows (show_id);

alter table public.user_watched_shows enable row level security;
