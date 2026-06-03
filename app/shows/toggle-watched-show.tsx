"use client";

import { useActionState } from "react";

import { toggleShowWatched } from "@/app/actions/toggle-show-watched";
import type { Show } from "@/lib/shows/types";

const initialState = { success: false as const, errors: {} };

type ToggleWatchedShowProps = {
  data: Show;
  variant?: "overlay" | "hero";
};

export function ToggleWatchedShow({
  data,
  variant = "overlay",
}: ToggleWatchedShowProps) {
  const [state, formAction, pending] = useActionState(
    toggleShowWatched,
    initialState,
  );

  const nextWatched = !data.watched;
  const isHero = variant === "hero";

  return (
    <form
      action={formAction}
      className={isHero ? "flex flex-col gap-2" : "contents"}
      onClick={(e) => e.stopPropagation()}
    >
      <input type="hidden" name="showId" value={String(data.id)} />
      <input
        type="hidden"
        name="watched"
        value={nextWatched ? "true" : "false"}
      />
      <button
        type="submit"
        disabled={pending}
        aria-label={
          data.watched
            ? `Mark ${data.name} as not watched`
            : `Mark ${data.name} as watched`
        }
        aria-pressed={data.watched}
        className={
          isHero
            ? `inline-flex h-12 w-full max-w-xs items-center justify-center gap-2 rounded-2xl px-5 text-sm font-semibold shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:opacity-60 dark:focus-visible:ring-offset-zinc-950 ${
                data.watched
                  ? "bg-violet-600 text-white hover:bg-violet-500 dark:bg-violet-500 dark:hover:bg-violet-400"
                  : "border border-zinc-300 bg-white/90 text-zinc-900 hover:border-violet-400 hover:bg-violet-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:border-violet-500 dark:hover:bg-violet-950/50"
              }`
            : `absolute bottom-2 right-2 inline-flex translate-y-1 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-lg backdrop-blur transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950 ${
                data.watched
                  ? "bg-violet-600 text-white opacity-100 hover:bg-violet-500 disabled:opacity-70 dark:bg-violet-500 dark:hover:bg-violet-400"
                  : "bg-zinc-900/85 text-white opacity-0 hover:bg-violet-600 disabled:opacity-70 group-hover:opacity-100 dark:bg-zinc-100/90 dark:text-zinc-900 dark:hover:bg-violet-500 dark:hover:text-white"
              }`
        }
      >
        <CheckIcon
          className={isHero ? "h-4 w-4 shrink-0" : "h-3 w-3 shrink-0"}
        />
        {data.watched ? "Watched" : "Mark as watched"}
      </button>
      {!state.success && state.errors.root ? (
        <span className="sr-only">{state.errors.root.join(" ")}</span>
      ) : null}
    </form>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}
