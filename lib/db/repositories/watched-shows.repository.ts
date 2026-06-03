import type { SupabaseClient } from "@supabase/supabase-js";

export async function getWatchedShowIds(
  userId: number,
  showIds: number[],
  supabase: SupabaseClient,
): Promise<Set<number>> {
  if (showIds.length === 0) {
    return new Set();
  }

  const { data, error } = await supabase
    .from("user_watched_shows")
    .select("show_id")
    .eq("user_id", userId)
    .in("show_id", showIds);

  if (error) {
    throw new Error(`getWatchedShowIds: ${error.message}`);
  }

  return new Set((data ?? []).map((row) => row.show_id));
}

export async function getWatchedShows(
  userId: number,
  supabase: SupabaseClient,
): Promise<{ id: number; name: string }[]> {
  const { data: watched, error: watchedError } = await supabase
    .from("user_watched_shows")
    .select("show_id")
    .eq("user_id", userId)
    .order("watched_at", { ascending: false });

  if (watchedError) {
    throw new Error(`getWatchedShows: ${watchedError.message}`);
  }

  if (!watched?.length) {
    return [];
  }

  const showIds = watched.map((row) => row.show_id);
  const { data: shows, error: showsError } = await supabase
    .from("shows")
    .select("id, name")
    .in("id", showIds);

  if (showsError) {
    throw new Error(`getWatchedShows: ${showsError.message}`);
  }

  const nameById = new Map(
    (shows ?? []).map((show) => [show.id, show.name] as const),
  );

  return showIds
    .filter((id) => nameById.has(id))
    .map((id) => ({ id, name: nameById.get(id)! }));
}

export async function insertUserWatchedShow(
  userId: number,
  showId: number,
  supabase: SupabaseClient,
): Promise<void> {
  const { error } = await supabase
    .from("user_watched_shows")
    .upsert(
      { user_id: userId, show_id: showId },
      { onConflict: "user_id,show_id", ignoreDuplicates: true },
    );

  if (error) {
    throw new Error(`insertUserWatchedShow: ${error.message}`);
  }
}

export async function deleteUserWatchedShow(
  userId: number,
  showId: number,
  supabase: SupabaseClient,
): Promise<void> {
  const { error } = await supabase
    .from("user_watched_shows")
    .delete()
    .eq("user_id", userId)
    .eq("show_id", showId);

  if (error) {
    throw new Error(`deleteUserWatchedShow: ${error.message}`);
  }
}
