"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth/get-current-user";
import {
  deleteUserWatchedShow,
  findShowById,
  insertUserWatchedShow,
} from "@/lib/db";
import { toggleShowWatchedForUser } from "@/lib/shows/services/toggle-watched.service";

export type ToggleShowWatchedState =
  | { success: true }
  | { success: false; errors: Record<string, string[] | undefined> };

export async function toggleShowWatched(
  _prev: ToggleShowWatchedState,
  formData: FormData,
): Promise<ToggleShowWatchedState> {
  const result = await toggleShowWatchedForUser(
    {
      showId: formData.get("showId"),
      watched: formData.get("watched"),
    },
    {
      getCurrentUser,
      findShowById,
      insertUserWatchedShow,
      deleteUserWatchedShow,
    },
  );

  if (result.kind === "validation") {
    return { success: false, errors: result.errors };
  }

  if (result.kind === "unauthorized") {
    return { success: false, errors: result.errors };
  }

  if (result.kind === "not_found") {
    return { success: false, errors: result.errors };
  }

  revalidatePath("/shows");
  revalidatePath("/recommendations");
  revalidatePath(`/shows/${result.showId}`);

  return { success: true };
}
