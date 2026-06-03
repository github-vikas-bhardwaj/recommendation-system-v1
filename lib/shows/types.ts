export type Show = {
  id: number;
  name: string;
  type: string | null;
  language: string | null;
  status: string | null;
  premiered: string | null;
  ended: string | null;
  weight: number | null;
  source_genres: string[];
  image_url: string | null;
  summary: string | null;
  watched: boolean;
};
