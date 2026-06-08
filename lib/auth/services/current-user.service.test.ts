import { describe, expect, it, vi } from "vitest";

import { hashSessionToken } from "../hash-token";
import { resolveCurrentUser } from "./current-user.service";

const user = { id: 7, name: "Vikas", email: "you@example.com" };

describe("resolveCurrentUser", () => {
  it("returns null when token is missing", async () => {
    const result = await resolveCurrentUser(undefined, {
      findSessionByHash: vi.fn(),
      findUserById: vi.fn(),
      deleteSessionByHash: vi.fn(),
    });

    expect(result).toBeNull();
  });

  it("returns null when session is missing", async () => {
    const result = await resolveCurrentUser("token", {
      findSessionByHash: vi.fn().mockResolvedValue(null),
      findUserById: vi.fn(),
      deleteSessionByHash: vi.fn(),
    });

    expect(result).toBeNull();
  });

  it("deletes expired sessions and returns null", async () => {
    const deleteSessionByHash = vi.fn().mockResolvedValue(undefined);
    const tokenHash = hashSessionToken("expired-token");

    const result = await resolveCurrentUser("expired-token", {
      findSessionByHash: vi.fn().mockResolvedValue({
        user_id: 7,
        expires_at: "2020-01-01T00:00:00.000Z",
      }),
      findUserById: vi.fn(),
      deleteSessionByHash,
      now: () => Date.parse("2026-01-01T00:00:00.000Z"),
    });

    expect(result).toBeNull();
    expect(deleteSessionByHash).toHaveBeenCalledWith(tokenHash);
  });

  it("returns user for valid session", async () => {
    const result = await resolveCurrentUser("valid-token", {
      findSessionByHash: vi.fn().mockResolvedValue({
        user_id: 7,
        expires_at: "2099-01-01T00:00:00.000Z",
      }),
      findUserById: vi.fn().mockResolvedValue(user),
      deleteSessionByHash: vi.fn(),
      now: () => Date.parse("2026-01-01T00:00:00.000Z"),
    });

    expect(result).toEqual(user);
  });
});
