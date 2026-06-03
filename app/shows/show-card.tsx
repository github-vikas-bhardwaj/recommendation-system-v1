import Image from "next/image";
import Link from "next/link";

import { formatYearRange, splitGenres, stripHtml } from "@/lib/shows/format";
import type { Show } from "@/lib/shows/types";

import { ToggleWatchedShow } from "./toggle-watched-show";

export type { Show };

type ShowCardProps = {
  show: Show;
  listPage: number;
};

export function ShowCard({ show, listPage }: ShowCardProps) {
  const year = formatYearRange(show.premiered, show.ended);
  const genres = splitGenres(show.source_genres);
  const summary = stripHtml(show.summary).slice(0, 220);
  const safeListPage =
    Number.isFinite(listPage) && listPage >= 1 ? Math.floor(listPage) : 1;
  const detailHref =
    safeListPage <= 1
      ? `/shows/${show.id}`
      : `/shows/${show.id}?fromPage=${safeListPage}`;

  return (
    <Link href={detailHref}>
      <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/70 shadow-sm shadow-zinc-900/5 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-600/10 dark:border-zinc-800/80 dark:bg-zinc-950/60 dark:hover:border-violet-700/60 dark:hover:shadow-violet-900/20 hover:cursor-pointer">
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
          {show.image_url ? (
            <Image
              src={show.image_url}
              alt={show.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 34vw, (max-width: 1280px) 25vw, 20vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs uppercase tracking-wide text-zinc-400">
              No image
            </div>
          )}

          {show.status ? (
            <span className="absolute left-2 top-2 inline-flex items-center rounded-full bg-white/85 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-700 backdrop-blur dark:bg-zinc-950/80 dark:text-zinc-200">
              {show.status}
            </span>
          ) : null}
          <ToggleWatchedShow data={show} />
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="text-sm font-semibold leading-tight text-zinc-900 line-clamp-2 dark:text-zinc-50">
            {show.name}
          </h3>

          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {[year, show.type].filter(Boolean).join(" · ")}
          </p>

          {genres.length > 0 ? (
            <ul className="mt-1 flex flex-wrap gap-1">
              {genres.slice(0, 3).map((g) => (
                <li
                  key={g}
                  className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-medium text-violet-700 ring-1 ring-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:ring-violet-900/60"
                >
                  {g}
                </li>
              ))}
              {genres.length > 3 ? (
                <li className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600 ring-1 ring-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:ring-zinc-800">
                  +{genres.length - 3}
                </li>
              ) : null}
            </ul>
          ) : null}

          {summary ? (
            <p className="mt-1 text-xs leading-relaxed text-zinc-600 line-clamp-3 dark:text-zinc-400">
              {summary}
              {summary.length === 220 ? "…" : ""}
            </p>
          ) : null}
        </div>
      </article>
    </Link>
  );
}
