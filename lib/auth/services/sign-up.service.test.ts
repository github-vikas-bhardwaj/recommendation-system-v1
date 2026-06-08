import { describe, expect, it, vi } from "vitest";

import { signUpUser } from "./sign-up.service";

describe("signUpUser", () => {
  it("returns validation failure for invalid input", async () => {
    const result = await signUpUser(
      {
        name: "",
        email: "not-an-email",
        password: "short",
        confirm: "different",
      },
      {
        hashPassword: vi.fn(),
        insertUser: vi.fn(),
      },
    );

    expect(result.kind).toBe("validation");
  });

  it("returns db error when email is taken", async () => {
    const result = await signUpUser(
      {
        name: "Vikas",
        email: "you@example.com",
        password: "password123",
        confirm: "password123",
      },
      {
        hashPassword: vi.fn().mockResolvedValue("hash"),
        insertUser: vi.fn().mockResolvedValue({
          success: false,
          reason: "EMAIL_TAKEN",
        }),
      },
    );

    expect(result).toEqual({
      kind: "db_error",
      message: "An account with this email already exists.",
      values: { name: "Vikas", email: "you@example.com" },
    });
  });

  it("returns success when user is created", async () => {
    const hashPassword = vi.fn().mockResolvedValue("hash");
    const insertUser = vi.fn().mockResolvedValue({ success: true, userId: 99 });

    const result = await signUpUser(
      {
        name: "Vikas",
        email: "you@example.com",
        password: "password123",
        confirm: "password123",
      },
      { hashPassword, insertUser },
    );

    expect(result).toEqual({ kind: "success", userId: 99 });
    expect(hashPassword).toHaveBeenCalledWith("password123");
    expect(insertUser).toHaveBeenCalledWith({
      name: "Vikas",
      email: "you@example.com",
      passwordHash: "hash",
    });
  });
});
