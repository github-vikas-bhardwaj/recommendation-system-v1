import type { ShowRow } from "@/lib/db/types";
import type { Show } from "@/lib/shows/types";

export function mapShowRow(row: ShowRow, watched: boolean): Show {
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
