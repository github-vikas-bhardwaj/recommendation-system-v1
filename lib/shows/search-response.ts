import type { Show } from "@/lib/shows/types";

export function toSearchResultShow(show: Show) {
  return {
    id: show.id,
    name: show.name,
    source_genres: show.source_genres,
    image_url: show.image_url,
    watched: show.watched,
  };
}

export type SearchResultShow = ReturnType<typeof toSearchResultShow>;
