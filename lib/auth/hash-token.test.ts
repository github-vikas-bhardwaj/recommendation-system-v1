import { describe, expect, it } from "vitest";

import { generateSessionToken, hashSessionToken } from "./hash-token";

describe("hashSessionToken", () => {
  it("returns a deterministic sha256 hex digest", () => {
    expect(hashSessionToken("same-token")).toBe(hashSessionToken("same-token"));
    expect(hashSessionToken("same-token")).toMatch(/^[a-f0-9]{64}$/);
  });

  it("changes output when token changes", () => {
    expect(hashSessionToken("token-a")).not.toBe(hashSessionToken("token-b"));
  });
});

describe("generateSessionToken", () => {
  it("returns base64url tokens", () => {
    const token = generateSessionToken();

    expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(token.length).toBeGreaterThan(20);
  });
});
