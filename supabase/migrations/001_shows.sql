-- English scripted catalog (data/shows-scripted-english.json)
-- Maps: JSON "genres" → source_genres, JSON image.original → image_url
-- Embeddings: add later in a separate migration (002_add_embeddings.sql)

create table if not exists public.shows (
  id integer primary key,
  name text not null,
  type text not null default 'Scripted',
  language text not null default 'English',
  source_genres text[] not null default '{}',
  status text not null,
  premiered date,
  ended text not null,
  weight smallint not null,
  image_url text,
  summary text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists shows_name_idx on public.shows (name);
create index if not exists shows_source_genres_idx on public.shows using gin (source_genres);

comment on table public.shows is 'English scripted shows; taste matching will use summary (+ embeddings in a later phase)';
comment on column public.shows.source_genres is 'Raw TVMaze genres from JSON "genres"; audit only';
comment on column public.shows.premiered is 'Nullable when missing in source (~607 rows)';
comment on column public.shows.ended is 'YYYY-MM-DD or Present';
comment on column public.shows.image_url is 'From JSON image.original; nullable (~1267 rows)';
