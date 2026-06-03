import "server-only";

import type { Show } from "@/lib/shows/types";
import { createSupabaseClient } from "@/utils/supabase/server";

import { getWatchedShowIds } from "./watched-shows";

export async function getShowById(
  showId: number,
  userId: number,
): Promise<Show | null> {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from("shows")
    .select(
      "id, name, type, language, status, premiered, ended, weight, source_genres, image_url, summary",
    )
    .eq("id", showId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const watchedIds = await getWatchedShowIds(userId, [data.id]);

  return {
    id: data.id,
    name: data.name,
    type: data.type,
    language: data.language,
    status: data.status,
    premiered: data.premiered,
    ended: data.ended,
    weight: data.weight,
    source_genres: data.source_genres ?? [],
    image_url: data.image_url,
    summary: data.summary,
    watched: watchedIds.has(data.id),
  };
}
