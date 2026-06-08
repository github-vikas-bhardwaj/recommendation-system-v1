import { describe, expect, it, vi } from "vitest";

import { SESSION_DURATION_SECONDS } from "../constants";
import { hashSessionToken } from "../hash-token";
import { createUserSession, destroyUserSession } from "./session.service";

describe("createUserSession", () => {
  it("stores hashed session and sets cookie", async () => {
    const insertSession = vi.fn().mockResolvedValue(undefined);
    const setSessionCookie = vi.fn();
    const now = () => Date.parse("2026-01-01T00:00:00.000Z");

    await createUserSession(42, {
      insertSession,
      setSessionCookie,
      generateToken: () => "session-token",
      now,
    });

    expect(insertSession).toHaveBeenCalledWith({
      token_hash: hashSessionToken("session-token"),
      user_id: 42,
      expires_at: new Date(
        now() + SESSION_DURATION_SECONDS * 1000,
      ).toISOString(),
    });
    expect(setSessionCookie).toHaveBeenCalledWith("session-token");
  });
});

describe("destroyUserSession", () => {
  it("deletes session by hashed token", async () => {
    const deleteSessionByHash = vi.fn().mockResolvedValue(undefined);

    await destroyUserSession("session-token", { deleteSessionByHash });

    expect(deleteSessionByHash).toHaveBeenCalledWith(
      hashSessionToken("session-token"),
    );
  });
});
