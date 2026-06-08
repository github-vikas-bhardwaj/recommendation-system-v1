import { describe, expect, it } from "vitest";

import { signUpSchema } from "./sign-up.schema";

describe("signUpSchema", () => {
  it("accepts matching passwords", () => {
    const result = signUpSchema.safeParse({
      name: "  Vikas  ",
      email: "  You@Example.COM  ",
      password: "password123",
      confirm: "password123",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Vikas");
      expect(result.data.email).toBe("you@example.com");
    }
  });

  it("rejects mismatched passwords", () => {
    const result = signUpSchema.safeParse({
      name: "Vikas",
      email: "you@example.com",
      password: "password123",
      confirm: "different",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.confirm).toBeDefined();
    }
  });

  it("rejects short passwords", () => {
    const result = signUpSchema.safeParse({
      name: "Vikas",
      email: "you@example.com",
      password: "short",
      confirm: "short",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.password).toBeDefined();
    }
  });
});
