import { describe, expect, it, vi } from "vitest";

import { signInUser } from "./sign-in.service";

describe("signInUser", () => {
  it("returns validation failure for invalid email", async () => {
    const result = await signInUser(
      { email: "not-an-email", password: "secret" },
      {
        findUserByEmail: vi.fn(),
        verifyPassword: vi.fn(),
      },
    );

    expect(result.kind).toBe("validation");
  });

  it("returns invalid credentials when user is missing", async () => {
    const result = await signInUser(
      { email: "you@example.com", password: "secret" },
      {
        findUserByEmail: vi.fn().mockResolvedValue(null),
        verifyPassword: vi.fn(),
      },
    );

    expect(result).toEqual({
      kind: "invalid_credentials",
      message: "Wrong credentials! Please try again.",
    });
  });

  it("returns invalid credentials when password does not match", async () => {
    const result = await signInUser(
      { email: "you@example.com", password: "wrong" },
      {
        findUserByEmail: vi.fn().mockResolvedValue({
          id: 42,
          email: "you@example.com",
          password_hash: "hash",
        }),
        verifyPassword: vi.fn().mockResolvedValue(false),
      },
    );

    expect(result).toEqual({
      kind: "invalid_credentials",
      message: "Wrong credentials! Please try again.",
      values: { email: "you@example.com" },
    });
  });

  it("returns success when credentials match", async () => {
    const result = await signInUser(
      { email: "you@example.com", password: "secret" },
      {
        findUserByEmail: vi.fn().mockResolvedValue({
          id: 42,
          email: "you@example.com",
          password_hash: "hash",
        }),
        verifyPassword: vi.fn().mockResolvedValue(true),
      },
    );

    expect(result).toEqual({ kind: "success", userId: 42 });
  });
});
