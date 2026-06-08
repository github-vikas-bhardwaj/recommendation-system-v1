import { describe, expect, it } from "vitest";

import { buildIlikeNamePattern, normalizeSearchQuery } from "./search-query";

describe("normalizeSearchQuery", () => {
  it("returns null for queries shorter than two characters", () => {
    expect(normalizeSearchQuery("")).toBeNull();
    expect(normalizeSearchQuery("  a  ")).toBeNull();
  });

  it("returns trimmed query when long enough", () => {
    expect(normalizeSearchQuery("  ab  ")).toBe("ab");
  });
});

describe("buildIlikeNamePattern", () => {
  it("wraps query in wildcards", () => {
    expect(buildIlikeNamePattern("breaking")).toBe("%breaking%");
  });

  it("escapes ilike special characters", () => {
    expect(buildIlikeNamePattern("100%")).toBe("%100\\%%");
    expect(buildIlikeNamePattern("a_b\\c")).toBe("%a\\_b\\\\c%");
  });
});
