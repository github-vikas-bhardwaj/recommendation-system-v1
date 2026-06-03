import "server-only";

import { createSupabaseAdminClient } from "@/utils/supabase/admin";
import { createSupabaseClient } from "@/utils/supabase/server";

import * as findShowRepo from "./repositories/find-show.repository";
import * as showDetailRepo from "./repositories/show-detail.repository";
import * as showsRepo from "./repositories/shows.repository";
import * as usersRepo from "./repositories/users.repository";
import * as watchedShowsRepo from "./repositories/watched-shows.repository";

export type {
  InsertUserInput,
  InsertUserResult,
  ShowRow,
  UserWithPassword,
} from "./types";

export { SHOWS_PAGE_SIZE } from "./repositories/shows.repository";

export async function findUserByEmail(email: string) {
  return usersRepo.findUserByEmail(email, createSupabaseAdminClient());
}

export async function insertUser(
  user: Parameters<typeof usersRepo.insertUser>[0],
) {
  return usersRepo.insertUser(user, createSupabaseAdminClient());
}

export async function findShowById(showId: number) {
  return findShowRepo.findShowById(showId, createSupabaseAdminClient());
}

export async function getWatchedShowIds(userId: number, showIds: number[]) {
  return watchedShowsRepo.getWatchedShowIds(
    userId,
    showIds,
    createSupabaseAdminClient(),
  );
}

export async function getWatchedShows(userId: number) {
  return watchedShowsRepo.getWatchedShows(userId, createSupabaseAdminClient());
}

export async function insertUserWatchedShow(userId: number, showId: number) {
  return watchedShowsRepo.insertUserWatchedShow(
    userId,
    showId,
    createSupabaseAdminClient(),
  );
}

export async function deleteUserWatchedShow(userId: number, showId: number) {
  return watchedShowsRepo.deleteUserWatchedShow(
    userId,
    showId,
    createSupabaseAdminClient(),
  );
}

export async function getShowsTotalCount() {
  const supabase = await createSupabaseClient();
  return showsRepo.getShowsTotalCount(supabase);
}

export async function getShowsPage(
  userId: number,
  page: number,
  pageSize: number = showsRepo.SHOWS_PAGE_SIZE,
) {
  const showsClient = await createSupabaseClient();
  const watchedClient = createSupabaseAdminClient();
  return showsRepo.getShowsPage(
    userId,
    page,
    pageSize,
    showsClient,
    watchedClient,
  );
}

export async function searchShowsForUser(
  userId: number,
  query: string,
  limit = 10,
) {
  const showsClient = await createSupabaseClient();
  const watchedClient = createSupabaseAdminClient();
  return showsRepo.searchShowsForUser(
    userId,
    query,
    limit,
    showsClient,
    watchedClient,
  );
}

export async function getShowById(showId: number, userId: number) {
  const showsClient = await createSupabaseClient();
  const watchedClient = createSupabaseAdminClient();
  return showDetailRepo.getShowById(showId, userId, showsClient, watchedClient);
}
