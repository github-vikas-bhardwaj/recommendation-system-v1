import type { CurrentUser } from "@/lib/auth/types";
import {
  toggleShowWatchedSchema,
  type ToggleShowWatchedFieldErrors,
} from "@/lib/shows/schemas/toggle-watched.schema";

export type ToggleShowWatchedDeps = {
  getCurrentUser: () => Promise<CurrentUser | null>;
  findShowById: (showId: number) => Promise<number | null>;
  insertUserWatchedShow: (userId: number, showId: number) => Promise<void>;
  deleteUserWatchedShow: (userId: number, showId: number) => Promise<void>;
};

export type ToggleShowWatchedValidationFailure = {
  kind: "validation";
  errors: ToggleShowWatchedFieldErrors;
};

export type ToggleShowWatchedUnauthorizedFailure = {
  kind: "unauthorized";
  errors: { root: string[] };
};

export type ToggleShowWatchedNotFoundFailure = {
  kind: "not_found";
  errors: { showId: string[] };
};

export type ToggleShowWatchedSuccess = {
  kind: "success";
  showId: number;
};

export type ToggleShowWatchedResult =
  | ToggleShowWatchedSuccess
  | ToggleShowWatchedValidationFailure
  | ToggleShowWatchedUnauthorizedFailure
  | ToggleShowWatchedNotFoundFailure;

export async function toggleShowWatchedForUser(
  raw: { showId: unknown; watched: unknown },
  deps: ToggleShowWatchedDeps,
): Promise<ToggleShowWatchedResult> {
  const parsed = toggleShowWatchedSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      kind: "validation",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const user = await deps.getCurrentUser();
  if (!user) {
    return {
      kind: "unauthorized",
      errors: { root: ["You must be signed in."] },
    };
  }

  const { showId, watched } = parsed.data;
  const exists = await deps.findShowById(showId);
  if (exists === null) {
    return {
      kind: "not_found",
      errors: { showId: ["Show not found"] },
    };
  }

  if (watched) {
    await deps.insertUserWatchedShow(user.id, showId);
  } else {
    await deps.deleteUserWatchedShow(user.id, showId);
  }

  return { kind: "success", showId };
}
