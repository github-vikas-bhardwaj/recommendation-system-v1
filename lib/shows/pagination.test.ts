import { describe, expect, it } from "vitest";

import { pageOffset, sanitizePage } from "./pagination";

describe("sanitizePage", () => {
  it("returns 1 for invalid pages", () => {
    expect(sanitizePage(NaN)).toBe(1);
    expect(sanitizePage(0)).toBe(1);
  });
});

describe("pageOffset", () => {
  it("returns zero-based offset", () => {
    expect(pageOffset(1, 10)).toBe(0);
    expect(pageOffset(3, 10)).toBe(20);
  });
});
