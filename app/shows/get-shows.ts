import "server-only";

import {
  SHOWS_PAGE_SIZE,
  getShowsPage as getShowsPageFromDb,
  getShowsTotalCount,
} from "@/lib/db";

export { SHOWS_PAGE_SIZE, getShowsTotalCount };

export async function getShowsPage(
  userId: number,
  page: number,
  pageSize: number = SHOWS_PAGE_SIZE,
) {
  return getShowsPageFromDb(userId, page, pageSize);
}
