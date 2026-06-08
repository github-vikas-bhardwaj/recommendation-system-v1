import { describe, expect, it, vi } from "vitest";

import { toggleShowWatchedForUser } from "./toggle-watched.service";

const user = { id: 1, name: "Vikas", email: "you@example.com" };

describe("toggleShowWatchedForUser", () => {
  it("returns validation errors for invalid payload", async () => {
    const result = await toggleShowWatchedForUser(
      { showId: "0", watched: "maybe" },
      {
        getCurrentUser: vi.fn(),
        findShowById: vi.fn(),
        insertUserWatchedShow: vi.fn(),
        deleteUserWatchedShow: vi.fn(),
      },
    );

    expect(result.kind).toBe("validation");
  });

  it("returns unauthorized when user is not signed in", async () => {
    const result = await toggleShowWatchedForUser(
      { showId: "1", watched: "true" },
      {
        getCurrentUser: vi.fn().mockResolvedValue(null),
        findShowById: vi.fn(),
        insertUserWatchedShow: vi.fn(),
        deleteUserWatchedShow: vi.fn(),
      },
    );

    expect(result).toEqual({
      kind: "unauthorized",
      errors: { root: ["You must be signed in."] },
    });
  });

  it("returns not found when show does not exist", async () => {
    const result = await toggleShowWatchedForUser(
      { showId: "99", watched: "true" },
      {
        getCurrentUser: vi.fn().mockResolvedValue(user),
        findShowById: vi.fn().mockResolvedValue(null),
        insertUserWatchedShow: vi.fn(),
        deleteUserWatchedShow: vi.fn(),
      },
    );

    expect(result).toEqual({
      kind: "not_found",
      errors: { showId: ["Show not found"] },
    });
  });

  it("marks show as watched", async () => {
    const insertUserWatchedShow = vi.fn().mockResolvedValue(undefined);

    const result = await toggleShowWatchedForUser(
      { showId: "5", watched: "true" },
      {
        getCurrentUser: vi.fn().mockResolvedValue(user),
        findShowById: vi.fn().mockResolvedValue(5),
        insertUserWatchedShow,
        deleteUserWatchedShow: vi.fn(),
      },
    );

    expect(result).toEqual({ kind: "success", showId: 5 });
    expect(insertUserWatchedShow).toHaveBeenCalledWith(1, 5);
  });

  it("removes watched show", async () => {
    const deleteUserWatchedShow = vi.fn().mockResolvedValue(undefined);

    const result = await toggleShowWatchedForUser(
      { showId: "5", watched: "false" },
      {
        getCurrentUser: vi.fn().mockResolvedValue(user),
        findShowById: vi.fn().mockResolvedValue(5),
        insertUserWatchedShow: vi.fn(),
        deleteUserWatchedShow,
      },
    );

    expect(result).toEqual({ kind: "success", showId: 5 });
    expect(deleteUserWatchedShow).toHaveBeenCalledWith(1, 5);
  });
});
