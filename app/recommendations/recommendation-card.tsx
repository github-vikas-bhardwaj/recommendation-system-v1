"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { Recommendation } from "@/lib/recommendations";
import { splitGenres } from "@/lib/shows/format";

type RecommendationCardProps = {
  recommendation: Recommendation;
  rank: number;
};

export function RecommendationCard({
  recommendation,
  rank,
}: RecommendationCardProps) {
  const [showThinking, setShowThinking] = useState(false);
  const genres = splitGenres(recommendation.genres);
  const meta = [recommendation.year, recommendation.platform]
    .filter(Boolean)
    .join(" · ");
  const hasThinking = recommendation.thinking.trim().length > 0;

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/70 shadow-sm shadow-zinc-900/5 backdrop-blur transition-all hover:border-violet-300/80 hover:shadow-md hover:shadow-violet-600/10 dark:border-zinc-800/80 dark:bg-zinc-950/60 dark:hover:border-violet-700/50 dark:hover:shadow-violet-900/15">
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-violet-500 to-fuchsia-500 opacity-80" />

      <div className="flex flex-col gap-4 p-4 pl-5 sm:flex-row sm:items-start">
        <div className="flex shrink-0 items-start gap-3 sm:flex-col sm:items-center">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 text-xs font-bold text-violet-700 dark:bg-violet-950/60 dark:text-violet-300">
            {rank}
          </span>
          <Link
            href={`/shows/${recommendation.showId}`}
            className="relative block h-28 w-20 overflow-hidden rounded-xl bg-zinc-100 ring-1 ring-zinc-200/80 transition-transform group-hover:scale-[1.02] dark:bg-zinc-900 dark:ring-zinc-800"
          >
            {recommendation.imageUrl ? (
              <Image
                src={recommendation.imageUrl}
                alt={recommendation.name}
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : (
              <span className="flex h-full items-center justify-center text-[10px] text-zinc-400">
                No image
              </span>
            )}
          </Link>
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <Link
                href={`/shows/${recommendation.showId}`}
                className="text-base font-semibold text-zinc-900 hover:text-violet-700 dark:text-zinc-50 dark:hover:text-violet-300"
              >
                {recommendation.name}
              </Link>
              {meta ? (
                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                  {meta}
                </p>
              ) : null}
            </div>
            {recommendation.rating !== null ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-zinc-900/85 px-2.5 py-1 text-xs font-semibold text-white dark:bg-zinc-100/10">
                <StarIcon />
                {recommendation.rating.toFixed(1)}
              </span>
            ) : null}
          </div>

          {genres.length > 0 ? (
            <ul className="flex flex-wrap gap-1.5">
              {genres.slice(0, 4).map((g) => (
                <li
                  key={g}
                  className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-medium text-violet-700 ring-1 ring-violet-200/80 dark:bg-violet-950/40 dark:text-violet-300 dark:ring-violet-900/50"
                >
                  {g}
                </li>
              ))}
            </ul>
          ) : null}

          <div className="rounded-xl border border-violet-200/60 bg-gradient-to-br from-violet-50/90 to-fuchsia-50/40 dark:border-violet-900/40 dark:from-violet-950/30 dark:to-fuchsia-950/20">
            <div className="flex items-center justify-between gap-2 px-3.5 pt-3">
              <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-violet-700 dark:text-violet-400">
                <SparkleIcon />
                Why this pick
              </p>
              {hasThinking ? (
                <button
                  type="button"
                  onClick={() => setShowThinking((v) => !v)}
                  aria-expanded={showThinking}
                  aria-controls={`thinking-${recommendation.showId}`}
                  className="inline-flex items-center gap-1 rounded-lg border border-violet-200/80 bg-white/80 px-2 py-1 text-[10px] font-semibold text-violet-700 transition-colors hover:bg-violet-100 dark:border-violet-800/60 dark:bg-zinc-900/60 dark:text-violet-300 dark:hover:bg-violet-950/50"
                >
                  <BrainIcon />
                  {showThinking ? "Hide details" : "Show details"}
                  <ChevronIcon open={showThinking} />
                </button>
              ) : null}
            </div>
            <p className="px-3.5 pb-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              {recommendation.reason}
            </p>

            {hasThinking && showThinking ? (
              <div
                id={`thinking-${recommendation.showId}`}
                className="border-t border-violet-200/50 bg-zinc-900/[0.03] px-3.5 py-3 dark:border-violet-900/30 dark:bg-black/20"
              >
                <p className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  <BrainIcon />
                  More detail
                </p>
                <p className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {recommendation.thinking}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

function StarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-3 w-3 text-amber-400"
      aria-hidden
    >
      <path d="M12 2.5l2.9 6.3 6.9.7-5.2 4.7 1.5 6.8L12 17.8 5.9 21l1.5-6.8L2.2 9.5l6.9-.7L12 2.5z" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-3.5 w-3.5"
      aria-hidden
    >
      <path d="M9.813 2.658a1.875 1.875 0 0 1 1.874 0l1.69 1.035c.348.213.77.275 1.163.174l1.98-.51a1.875 1.875 0 0 1 2.186 1.267l.51 1.98c.101.393.039.815-.174 1.163l-1.035 1.69a1.875 1.875 0 0 0 0 1.874l1.035 1.69c.213.348.275.77.174 1.163l-.51 1.98a1.875 1.875 0 0 1-2.186 1.267l-1.98-.51a1.875 1.875 0 0 0-1.163.174l-1.69 1.035a1.875 1.875 0 0 1-1.874 0l-1.69-1.035a1.875 1.875 0 0 0-1.163-.174l-1.98.51a1.875 1.875 0 0 1-2.186-1.267l-.51-1.98a1.875 1.875 0 0 0-.174-1.163l1.035-1.69a1.875 1.875 0 0 0 0-1.874l-1.035-1.69a1.875 1.875 0 0 0 .174-1.163l.51-1.98a1.875 1.875 0 0 1 2.186-1.267l1.98.51c.393.101.815.039 1.163-.174l1.69-1.035Z" />
    </svg>
  );
}

function BrainIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-3 w-3"
      aria-hidden
    >
      <path d="M11.5 2a4.5 4.5 0 0 0-4.37 5.67A5.5 5.5 0 0 0 3 13.5c0 2.21 1.32 4.11 3.22 4.98A4.5 4.5 0 0 0 11.5 22a4.5 4.5 0 0 0 5.28-3.52A5.5 5.5 0 0 0 21 13.5a5.5 5.5 0 0 0-4.13-5.33A4.5 4.5 0 0 0 11.5 2Zm0 2a2.5 2.5 0 0 1 2.45 2h.05a3.5 3.5 0 0 1 3.5 3.5c0 .34-.05.67-.14.98A3.5 3.5 0 0 1 18.5 16c0 .83-.29 1.59-.77 2.19A2.5 2.5 0 0 1 11.5 20a2.5 2.5 0 0 1-6.23-1.81A3.5 3.5 0 0 1 5 13.5 3.5 3.5 0 0 1 8.5 10h.05A2.5 2.5 0 0 1 11.5 4Z" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
    </svg>
  );
}
