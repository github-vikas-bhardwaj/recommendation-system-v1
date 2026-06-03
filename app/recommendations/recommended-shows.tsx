import { RecommendationsList } from "@/app/recommendations/recommendations-list";

/** UI shell only — personalized results will plug in here later. */
export async function RecommendedShows() {
  return <RecommendationsList recommendations={[]} />;
}
