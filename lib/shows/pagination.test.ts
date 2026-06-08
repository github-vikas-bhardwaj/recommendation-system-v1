import { describe, expect, it } from "vitest";

import { pageOffset, sanitizePage, sanitizePageSize } from "./pagination";

describe("sanitizePage", () => {
  it("returns 1 for invalid pages", () => {
    expect(sanitizePage(NaN)).toBe(1);
    expect(sanitizePage(0)).toBe(1);
    expect(sanitizePage(-3)).toBe(1);
  });

  it("floors valid pages", () => {
    expect(sanitizePage(2.9)).toBe(2);
    expect(sanitizePage(5)).toBe(5);
  });
});

describe("sanitizePageSize", () => {
  it("clamps invalid page sizes to at least 1", () => {
    expect(sanitizePageSize(0, 10)).toBe(1);
  });

  it("uses fallback when page size is not a number", () => {
    expect(sanitizePageSize(NaN, 12)).toBe(12);
  });

  it("floors valid page sizes", () => {
    expect(sanitizePageSize(15.7, 10)).toBe(15);
  });
});

describe("pageOffset", () => {
  it("returns zero-based offset", () => {
    expect(pageOffset(1, 10)).toBe(0);
    expect(pageOffset(3, 10)).toBe(20);
  });
});
