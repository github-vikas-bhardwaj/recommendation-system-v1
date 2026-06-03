export type Recommendation = {
  showId: number;
  name: string;
  genres: string | string[] | null;
  rating: number | null;
  imageUrl: string | null;
  year: string | null;
  platform: string | null;
  reason: string;
  thinking: string;
};
