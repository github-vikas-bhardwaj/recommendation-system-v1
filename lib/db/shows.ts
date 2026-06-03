import "server-only";

import type { Show } from "@/lib/shows/types";
import { createSupabaseClient } from "@/utils/supabase/server";

import { getWatchedShowIds } from "./watched-shows";

export const SHOWS_PAGE_SIZE = 24;

type ShowRow = {
  id: number;
  name: string;
  type: string;
  language: string;
  status: string;
  premiered: string | null;
  ended: string;
  weight: number;
  source_genres: string[];
  image_url: string | null;
  summary: string;
};

function mapRow(row: ShowRow, watched: boolean): Show {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    language: row.language,
    status: row.status,
    premiered: row.premiered,
    ended: row.ended,
    weight: row.weight,
    source_genres: row.source_genres ?? [],
    image_url: row.image_url,
    summary: row.summary,
    watched,
  };
}

export async function getShowsTotalCount(): Promise<number> {
  const supabase = await createSupabaseClient();
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
  pageSize: number = SHOWS_PAGE_SIZE,
): Promise<Show[]> {
  const safePage = Number.isFinite(page) && page >= 1 ? Math.floor(page) : 1;
  const limit = Math.max(1, Math.floor(pageSize)) || SHOWS_PAGE_SIZE;
  const offset = (safePage - 1) * limit;

  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from("shows")
    .select(
      "id, name, type, language, status, premiered, ended, weight, source_genres, image_url, summary",
    )
    .order("weight", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error(`getShowsPage: ${error.message}`);
  }

  const rows = data as ShowRow[];
  const watchedIds = await getWatchedShowIds(
    userId,
    rows.map((row) => row.id),
  );

  return rows.map((row) => mapRow(row, watchedIds.has(row.id)));
}

function escapeIlikePattern(term: string) {
  return term.replace(/[%_\\]/g, (char) => `\\${char}`);
}

export async function searchShowsForUser(
  userId: number,
  query: string,
  limit = 10,
): Promise<Show[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) {
    return [];
  }

  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from("shows")
    .select(
      "id, name, type, language, status, premiered, ended, weight, source_genres, image_url, summary",
    )
    .ilike("name", `%${escapeIlikePattern(trimmed)}%`)
    .order("weight", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`searchShowsForUser: ${error.message}`);
  }

  const rows = data as ShowRow[];
  const watchedIds = await getWatchedShowIds(
    userId,
    rows.map((row) => row.id),
  );

  return rows.map((row) => mapRow(row, watchedIds.has(row.id)));
}
