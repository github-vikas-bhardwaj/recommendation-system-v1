import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getShowById } from "@/lib/db";
import { formatYearRange, splitGenres, stripHtml } from "@/lib/shows/format";

import { SHOWS_PAGE_SIZE, getShowsTotalCount } from "../get-shows";
import { ToggleWatchedShow } from "../toggle-watched-show";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ fromPage?: string }>;
};

export default async function ShowDetailPage({
  params,
  searchParams,
}: PageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/sign-in");
  }

  const { id } = await params;
  const showId = Number(id);
  if (!Number.isFinite(showId) || showId < 1) {
    notFound();
  }

  const show = await getShowById(showId, user.id);
  if (!show) {
    notFound();
  }

  const { fromPage: fromPageParam } = await searchParams;
  const fromPageStr = Array.isArray(fromPageParam)
    ? fromPageParam[0]
    : fromPageParam;
  const parsedFrom =
    fromPageStr !== undefined && fromPageStr !== ""
      ? Number.parseInt(fromPageStr, 10)
      : 1;
  const requestedReturnPage =
    Number.isFinite(parsedFrom) && parsedFrom >= 1 ? Math.floor(parsedFrom) : 1;
  const total = await getShowsTotalCount();
  const totalPages = Math.max(1, Math.ceil(total / SHOWS_PAGE_SIZE));
  const returnPage = Math.min(requestedReturnPage, totalPages);

  const genres = splitGenres(show.source_genres);
  const summaryText = stripHtml(show.summary);
  const yearLabel = formatYearRange(show.premiered, show.ended);

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8 pb-16 sm:py-12">
      <Link
        href={`/shows?page=${returnPage}`}
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition-colors hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400"
      >
        ← Back to shows
      </Link>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,280px)_1fr]">
        <div className="relative mx-auto aspect-[2/3] w-full max-w-[280px] overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900">
          {show.image_url ? (
            <Image
              src={show.image_url}
              alt={show.name}
              fill
              priority
              sizes="280px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-zinc-400">
              No poster
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight">{show.name}</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {[yearLabel, show.status, show.type].filter(Boolean).join(" · ")}
          </p>
          {genres.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {genres.map((g) => (
                <li
                  key={g}
                  className="rounded-full bg-violet-600/10 px-3 py-1 text-xs font-semibold text-violet-700 dark:text-violet-200"
                >
                  {g}
                </li>
              ))}
            </ul>
          ) : null}
          {summaryText ? (
            <p className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
              {summaryText}
            </p>
          ) : null}
          <ToggleWatchedShow data={show} variant="hero" />
          <a
            href={`https://www.tvmaze.com/shows/${show.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-300 px-5 text-sm font-semibold transition-colors hover:border-violet-400 dark:border-zinc-600"
          >
            Open on TVMaze
          </a>
        </div>
      </div>
    </div>
  );
}
