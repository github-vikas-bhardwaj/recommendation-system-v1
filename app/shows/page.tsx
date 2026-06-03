import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/get-current-user";

import { SHOWS_PAGE_SIZE, getShowsPage, getShowsTotalCount } from "./get-shows";
import { ShowCard } from "./show-card";
import { ShowSearch } from "./show-search";

type PageProps = {
  searchParams: Promise<{ page?: string }>;
};

function hrefForPage(page: number) {
  return `/shows?page=${page}`;
}

export default async function ShowsPage({ searchParams }: PageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/sign-in");
  }

  const { page: pageParam } = await searchParams;
  const pageStr = Array.isArray(pageParam) ? pageParam[0] : pageParam;
  if (pageStr === undefined || pageStr === "") {
    redirect("/shows?page=1");
  }

  const parsed = Number.parseInt(pageStr, 10);
  const requestedPage =
    Number.isFinite(parsed) && parsed >= 1 ? Math.floor(parsed) : 1;

  const total = await getShowsTotalCount();
  const totalPages = Math.max(1, Math.ceil(total / SHOWS_PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);

  const shows = await getShowsPage(user.id, page, SHOWS_PAGE_SIZE);

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">
        Recent Shows
      </h1>
      <ShowSearch />

      {shows.length === 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          No shows in the catalog yet. Run{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs dark:bg-zinc-800">
            npm run db:seed
          </code>{" "}
          against your Supabase project.
        </p>
      ) : (
        <>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
            {shows.map((show) => (
              <li key={show.id}>
                <ShowCard show={show} listPage={page} />
              </li>
            ))}
          </ul>

          <nav
            className="mt-10 flex flex-wrap items-center justify-center gap-2"
            aria-label="Shows pagination"
          >
            {page > 1 ? (
              <Link
                href={hrefForPage(page - 1)}
                className="inline-flex h-10 min-w-[7rem] items-center justify-center rounded-xl border border-zinc-300 px-4 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
              >
                Previous
              </Link>
            ) : (
              <span className="inline-flex h-10 min-w-[7rem] cursor-not-allowed items-center justify-center rounded-xl border border-zinc-200 px-4 text-sm font-medium text-zinc-400 dark:border-zinc-800 dark:text-zinc-600">
                Previous
              </span>
            )}

            <span className="px-3 text-sm text-zinc-600 dark:text-zinc-400">
              Page {page} of {totalPages}
            </span>

            {page < totalPages ? (
              <Link
                href={hrefForPage(page + 1)}
                className="inline-flex h-10 min-w-[7rem] items-center justify-center rounded-xl border border-zinc-300 px-4 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
              >
                Next
              </Link>
            ) : (
              <span className="inline-flex h-10 min-w-[7rem] cursor-not-allowed items-center justify-center rounded-xl border border-zinc-200 px-4 text-sm font-medium text-zinc-400 dark:border-zinc-800 dark:text-zinc-600">
                Next
              </span>
            )}
          </nav>
        </>
      )}
    </div>
  );
}
