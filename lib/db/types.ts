export type ShowRow = {
  id: number;
  name: string;
  type: string;
  language: string;
  status: string;
  premiered: string | null;
  ended: string;
  weight: number;
  source_genres: string[];
  image_url: string | null;
  summary: string;
};

export type UserWithPassword = {
  id: number;
  name: string;
  email: string;
  password_hash: string;
};

export type InsertUserInput = {
  name: string;
  email: string;
  passwordHash: string;
};

export type InsertUserResult =
  | { success: true; userId: number }
  | { success: false; reason: "EMAIL_TAKEN" | "UNKNOWN" };
