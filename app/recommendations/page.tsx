import { redirect } from "next/navigation";
import { Suspense } from "react";

import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getWatchedShows } from "@/lib/db";

import { RecommendationsSkeleton } from "./recommendations-skeleton";
import { RecommendedShows } from "./recommended-shows";
import { WatchedShowTags } from "./watched-shows-tags";

export default async function RecommendationsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/sign-in");
  }

  const watchedShows = await getWatchedShows(user.id);

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-10">
      <h1 className="mb-2 text-2xl font-semibold tracking-tight">
        Recommendations
      </h1>
      <p className="mb-10 text-sm text-zinc-600 dark:text-zinc-400">
        Building suggestions from your watched history ({watchedShows.length}{" "}
        shows).
      </p>

      <section className="mb-12 space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Watched shows
        </h2>
        {watchedShows.length === 0 ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            No watched shows found yet. Mark a few shows as watched first.
          </p>
        ) : (
          <WatchedShowTags shows={watchedShows} />
        )}
      </section>

      <Suspense fallback={<RecommendationsSkeleton />}>
        <RecommendedShows />
      </Suspense>
    </div>
  );
}
