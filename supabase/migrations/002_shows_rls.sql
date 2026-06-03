-- RLS for public.shows catalog
-- SELECT: app reads with publishable (anon) key
-- INSERT/UPDATE: allows local seed script (upsert) with publishable key
-- Remove insert/update policies after initial load; prefer service_role for seeding
-- should delete this file after initial load

alter table public.shows enable row level security;

create policy "shows_select_public"
  on public.shows
  for select
  to anon, authenticated
  using (true);

create policy "shows_insert_anon"
  on public.shows
  for insert
  to anon
  with check (true);

create policy "shows_update_anon"
  on public.shows
  for update
  to anon
  using (true)
  with check (true);
