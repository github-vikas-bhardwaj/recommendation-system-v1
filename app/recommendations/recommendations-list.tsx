import {
  MAX_RECOMMENDATIONS,
  type Recommendation,
} from "@/lib/recommendations";

import { RecommendationCard } from "./recommendation-card";

type RecommendationsListProps = {
  recommendations: Recommendation[];
};

export function RecommendationsList({
  recommendations,
}: RecommendationsListProps) {
  const items = recommendations.slice(0, MAX_RECOMMENDATIONS);

  if (items.length === 0) {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        No recommendations yet. Mark more shows as watched to get personalized
        picks.
      </p>
    );
  }

  return (
    <section className="space-y-4">
      <header className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-sm shadow-violet-600/30">
          <SparkleIcon />
        </span>
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Recommended for you
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {items.length} pick{items.length === 1 ? "" : "s"} based on your
            taste
          </p>
        </div>
      </header>

      <ol className="space-y-4">
        {items.map((rec, index) => (
          <li key={rec.showId}>
            <RecommendationCard recommendation={rec} rank={index + 1} />
          </li>
        ))}
      </ol>
    </section>
  );
}

function SparkleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden
    >
      <path d="M9.813 2.658a1.875 1.875 0 0 1 1.874 0l1.69 1.035c.348.213.77.275 1.163.174l1.98-.51a1.875 1.875 0 0 1 2.186 1.267l.51 1.98c.101.393.039.815-.174 1.163l-1.035 1.69a1.875 1.875 0 0 0 0 1.874l1.035 1.69c.213.348.275.77.174 1.163l-.51 1.98a1.875 1.875 0 0 1-2.186 1.267l-1.98-.51a1.875 1.875 0 0 0-1.163.174l-1.69 1.035a1.875 1.875 0 0 1-1.874 0l-1.69-1.035a1.875 1.875 0 0 0-1.163-.174l-1.98.51a1.875 1.875 0 0 1-2.186-1.267l-.51-1.98a1.875 1.875 0 0 0-.174-1.163l1.035-1.69a1.875 1.875 0 0 0 0-1.874l-1.035-1.69a1.875 1.875 0 0 0 .174-1.163l.51-1.98a1.875 1.875 0 0 1 2.186-1.267l1.98.51c.393.101.815.039 1.163-.174l1.69-1.035Z" />
    </svg>
  );
}
