"use client";

import { useActionState } from "react";

import { toggleShowWatched } from "@/app/actions/toggle-show-watched";

const initialState = { success: false as const, errors: {} };

type WatchedShowTagProps = {
  showId: number;
  name: string;
};

export function WatchedShowTag({ showId, name }: WatchedShowTagProps) {
  const [, formAction, pending] = useActionState(
    toggleShowWatched,
    initialState,
  );

  return (
    <form action={formAction}>
      <input type="hidden" name="showId" value={String(showId)} />
      <input type="hidden" name="watched" value="false" />
      <span className="inline-flex max-w-full items-center gap-0.5 rounded-full border border-zinc-200/80 bg-white/60 py-1 pl-3 pr-1 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-300">
        <span className="truncate">{name}</span>
        <button
          type="submit"
          disabled={pending}
          aria-label={`Remove ${name} from watched`}
          className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-200/80 hover:text-zinc-800 disabled:opacity-50 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        >
          <span aria-hidden className="text-sm leading-none">
            ×
          </span>
        </button>
      </span>
    </form>
  );
}
