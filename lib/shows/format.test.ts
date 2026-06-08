import { describe, expect, it } from "vitest";

import { formatYearRange, splitGenres, stripHtml } from "./format";

describe("formatYearRange", () => {
  it("returns empty string when premiere year is missing", () => {
    expect(formatYearRange(null, null)).toBe("");
  });

  it("formats ongoing shows", () => {
    expect(formatYearRange("2008-01-20", "Present")).toBe("2008–");
  });

  it("formats single-year and ranged shows", () => {
    expect(formatYearRange("2010-05-01", "2010-12-01")).toBe("2010");
    expect(formatYearRange("2010-05-01", "2015-05-01")).toBe("2010–2015");
  });
});

describe("stripHtml", () => {
  it("returns empty string for nullish values", () => {
    expect(stripHtml(null)).toBe("");
  });

  it("removes tags and collapses whitespace", () => {
    expect(stripHtml("<p>Hello <b>world</b></p>")).toBe("Hello world");
  });
});

describe("splitGenres", () => {
  it("returns empty array for empty input", () => {
    expect(splitGenres(null)).toEqual([]);
    expect(splitGenres("")).toEqual([]);
  });

  it("splits comma-separated genres", () => {
    expect(splitGenres(" Drama , Crime , ")).toEqual(["Drama", "Crime"]);
  });

  it("trims array values", () => {
    expect(splitGenres([" Sci-Fi ", ""])).toEqual(["Sci-Fi"]);
  });
});
