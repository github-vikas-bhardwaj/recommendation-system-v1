import type { SupabaseClient } from "@supabase/supabase-js";

import type { ShowRow } from "@/lib/db/types";
import { mapShowRow } from "@/lib/shows/map-show";
import type { Show } from "@/lib/shows/types";

import { getWatchedShowIds } from "./watched-shows.repository";

const SHOW_COLUMNS =
  "id, name, type, language, status, premiered, ended, weight, source_genres, image_url, summary";

export async function getShowById(
  showId: number,
  userId: number,
  showsClient: SupabaseClient,
  watchedClient: SupabaseClient,
): Promise<Show | null> {
  const { data, error } = await showsClient
    .from("shows")
    .select(SHOW_COLUMNS)
    .eq("id", showId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const row = data as ShowRow;
  const watchedIds = await getWatchedShowIds(userId, [row.id], watchedClient);

  return mapShowRow(row, watchedIds.has(row.id));
}
