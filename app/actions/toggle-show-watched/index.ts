"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth/get-current-user";
import {
  deleteUserWatchedShow,
  findShowById,
  insertUserWatchedShow,
} from "@/lib/db";

import { toggleShowWatchedSchema } from "./schema";

export type ToggleShowWatchedState =
  | { success: true }
  | { success: false; errors: Record<string, string[] | undefined> };

export async function toggleShowWatched(
  _prev: ToggleShowWatchedState,
  formData: FormData,
): Promise<ToggleShowWatchedState> {
  const parsed = toggleShowWatchedSchema.safeParse({
    showId: formData.get("showId"),
    watched: formData.get("watched"),
  });

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const user = await getCurrentUser();
  if (!user) {
    return {
      success: false,
      errors: { root: ["You must be signed in."] },
    };
  }

  const { showId, watched } = parsed.data;
  const exists = await findShowById(showId);
  if (exists === null) {
    return { success: false, errors: { showId: ["Show not found"] } };
  }

  if (watched) {
    await insertUserWatchedShow(user.id, showId);
  } else {
    await deleteUserWatchedShow(user.id, showId);
  }

  revalidatePath("/shows");
  revalidatePath("/recommendations");
  revalidatePath(`/shows/${showId}`);

  return { success: true };
}
