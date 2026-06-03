import { MAX_RECOMMENDATIONS } from "@/lib/recommendations";

/** For Suspense when a real recommendations loader is added later. */
export function RecommendationsSkeleton() {
  return (
    <section
      aria-busy="true"
      aria-label="Loading recommendations"
      className="space-y-4"
    >
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-xl" />
        <Skeleton className="h-6 w-48 rounded-lg" />
      </div>
      <Skeleton className="h-4 w-full max-w-xl rounded-md" />

      <ul className="mt-6 space-y-4">
        {Array.from({ length: MAX_RECOMMENDATIONS }, (_, i) => (
          <li
            key={i}
            className="flex gap-4 rounded-2xl border border-zinc-200/80 bg-white/60 p-4 dark:border-zinc-800/80 dark:bg-zinc-950/50"
          >
            <Skeleton className="h-28 w-20 shrink-0 rounded-xl sm:h-32 sm:w-24" />
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <Skeleton className="h-5 w-2/3 max-w-xs rounded-md" />
              <Skeleton className="h-3 w-40 rounded-md" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
              <Skeleton className="mt-1 h-16 w-full rounded-xl" />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-zinc-200/80 dark:bg-zinc-800/80 ${className ?? ""}`}
    />
  );
}
