"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { useActionState } from "react";

import { toggleShowWatched } from "@/app/actions/toggle-show-watched";
import { splitGenres } from "@/lib/shows/format";

const toggleInitialState = { success: false as const, errors: {} };

type SearchShow = {
  id: number;
  name: string;
  source_genres: string[];
  image_url: string | null;
  watched: boolean;
};

export function ShowSearch() {
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchShow[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchResults = useCallback(async (term: string) => {
    const trimmed = term.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `/api/shows/search?q=${encodeURIComponent(trimmed)}`,
      );
      if (!res.ok) {
        setResults([]);
        return;
      }
      const data = (await res.json()) as { shows: SearchShow[] };
      setResults(data.shows);
      setOpen(true);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      void fetchResults(query);
    }, 280);
    return () => window.clearTimeout(handle);
  }, [query, fetchResults]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const handleWatchedChange = useCallback(
    (showId: number, watched: boolean) => {
      setResults((prev) =>
        prev.map((s) => (s.id === showId ? { ...s, watched } : s)),
      );
    },
    [],
  );

  const showDropdown = open && query.trim().length >= 2;

  return (
    <SearchShell ref={containerRef}>
      <label htmlFor={`${listboxId}-input`} className="sr-only">
        Search shows
      </label>
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
        <input
          id={`${listboxId}-input`}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.trim().length >= 2 && results.length > 0) setOpen(true);
          }}
          placeholder="Search shows by title…"
          autoComplete="off"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={showDropdown ? `${listboxId}-listbox` : undefined}
          className="h-12 w-full rounded-2xl border border-zinc-200/90 bg-white/80 py-3 pl-12 pr-12 text-sm text-zinc-900 shadow-sm shadow-zinc-900/5 outline-none backdrop-blur transition-[box-shadow,border-color] placeholder:text-zinc-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/15 dark:border-zinc-700/90 dark:bg-zinc-950/70 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-violet-600"
        />
        {loading ? (
          <span
            className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-violet-500 border-t-transparent"
            aria-hidden
          />
        ) : query.length > 0 ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
              setOpen(false);
            }}
            className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            aria-label="Clear search"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {showDropdown ? (
        <ul
          id={`${listboxId}-listbox`}
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 max-h-[min(24rem,70vh)] overflow-y-auto rounded-2xl border border-zinc-200/90 bg-white/95 p-1.5 shadow-xl shadow-zinc-900/10 backdrop-blur-md dark:border-zinc-700/90 dark:bg-zinc-950/95 dark:shadow-black/40"
        >
          {results.length === 0 && !loading ? (
            <li className="px-4 py-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
              No shows match &ldquo;{query.trim()}&rdquo;
            </li>
          ) : (
            results.map((show) => (
              <SearchResultRow
                key={show.id}
                show={show}
                onWatchedChange={handleWatchedChange}
              />
            ))
          )}
        </ul>
      ) : null}
    </SearchShell>
  );
}

function SearchResultRow({
  show,
  onWatchedChange,
}: {
  show: SearchShow;
  onWatchedChange: (showId: number, watched: boolean) => void;
}) {
  const genres = splitGenres(show.source_genres).slice(0, 2);
  const [state, formAction, pending] = useActionState(
    toggleShowWatched,
    toggleInitialState,
  );
  const appliedSuccessRef = useRef(false);

  useEffect(() => {
    if (pending) {
      appliedSuccessRef.current = false;
    }
  }, [pending]);

  useEffect(() => {
    if (!state.success || appliedSuccessRef.current) return;
    appliedSuccessRef.current = true;
    onWatchedChange(show.id, !show.watched);
  }, [state.success, show.id, show.watched, onWatchedChange]);

  const nextWatched = !show.watched;

  return (
    <li
      role="option"
      aria-selected={false}
      className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-violet-50/80 dark:hover:bg-violet-950/30"
    >
      <Link
        href={`/shows/${show.id}`}
        className="flex min-w-0 flex-1 items-center gap-3"
      >
        <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900">
          {show.image_url ? (
            <Image
              src={show.image_url}
              alt=""
              fill
              sizes="40px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[9px] text-zinc-400">
              —
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
            {show.name}
          </p>
          <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
            {genres.length > 0 ? genres.join(" · ") : "TV show"}
          </p>
        </div>
      </Link>

      <form action={formAction} className="shrink-0">
        <input type="hidden" name="showId" value={String(show.id)} />
        <input
          type="hidden"
          name="watched"
          value={nextWatched ? "true" : "false"}
        />
        <button
          type="submit"
          disabled={pending}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 disabled:opacity-60 ${
            show.watched
              ? "bg-violet-600 text-white hover:bg-violet-500 dark:bg-violet-500"
              : "border border-zinc-200 bg-white text-zinc-800 hover:border-violet-400 hover:text-violet-700 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-violet-500"
          }`}
        >
          <CheckIcon className="h-3.5 w-3.5" />
          {show.watched ? "Watched" : "Mark watched"}
        </button>
      </form>
    </li>
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

function SearchShell({
  ref,
  children,
}: {
  ref: RefObject<HTMLDivElement | null>;
  children: ReactNode;
}) {
  return (
    <div ref={ref} className="relative mx-auto mb-8 w-full max-w-2xl">
      {children}
    </div>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      className={className}
      aria-hidden
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}
