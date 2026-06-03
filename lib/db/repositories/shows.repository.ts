import type { SupabaseClient } from "@supabase/supabase-js";

import type { ShowRow } from "@/lib/db/types";
import { mapShowRow } from "@/lib/shows/map-show";
import { pageOffset, sanitizePageSize } from "@/lib/shows/pagination";
import {
  buildIlikeNamePattern,
  normalizeSearchQuery,
} from "@/lib/shows/search-query";
import type { Show } from "@/lib/shows/types";

import { getWatchedShowIds } from "./watched-shows.repository";

export const SHOWS_PAGE_SIZE = 24;

const SHOW_COLUMNS =
  "id, name, type, language, status, premiered, ended, weight, source_genres, image_url, summary";

export async function getShowsTotalCount(
  supabase: SupabaseClient,
): Promise<number> {
  const { count, error } = await supabase
    .from("shows")
    .select("*", { count: "exact", head: true });

  if (error) {
    throw new Error(`getShowsTotalCount: ${error.message}`);
  }

  return count ?? 0;
}

export async function getShowsPage(
  userId: number,
  page: number,
  pageSize: number,
  showsClient: SupabaseClient,
  watchedClient: SupabaseClient,
): Promise<Show[]> {
  const limit = sanitizePageSize(pageSize, SHOWS_PAGE_SIZE);
  const offset = pageOffset(page, limit);

  const { data, error } = await showsClient
    .from("shows")
    .select(SHOW_COLUMNS)
    .order("weight", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error(`getShowsPage: ${error.message}`);
  }

  const rows = data as ShowRow[];
  const watchedIds = await getWatchedShowIds(
    userId,
    rows.map((row) => row.id),
    watchedClient,
  );

  return rows.map((row) => mapShowRow(row, watchedIds.has(row.id)));
}

export async function searchShowsForUser(
  userId: number,
  query: string,
  limit: number,
  showsClient: SupabaseClient,
  watchedClient: SupabaseClient,
): Promise<Show[]> {
  const normalizedQuery = normalizeSearchQuery(query);
  if (!normalizedQuery) {
    return [];
  }

  const { data, error } = await showsClient
    .from("shows")
    .select(SHOW_COLUMNS)
    .ilike("name", buildIlikeNamePattern(normalizedQuery))
    .order("weight", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`searchShowsForUser: ${error.message}`);
  }

  const rows = data as ShowRow[];
  const watchedIds = await getWatchedShowIds(
    userId,
    rows.map((row) => row.id),
    watchedClient,
  );

  return rows.map((row) => mapShowRow(row, watchedIds.has(row.id)));
}
