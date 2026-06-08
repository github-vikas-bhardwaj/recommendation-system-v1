import { describe, expect, it } from "vitest";

import type { ShowRow } from "@/lib/db/types";

import { mapShowRow } from "./map-show";

const showRow: ShowRow = {
  id: 1,
  name: "Breaking Bad",
  type: "Scripted",
  language: "English",
  status: "Ended",
  premiered: "2008-01-20",
  ended: "2013-09-29",
  weight: 99,
  source_genres: ["Drama", "Crime"],
  image_url: "https://example.com/bb.jpg",
  summary: "A chemistry teacher turns to crime.",
};

describe("mapShowRow", () => {
  it("maps database row to show with watched flag", () => {
    expect(mapShowRow(showRow, true)).toEqual({
      id: 1,
      name: "Breaking Bad",
      type: "Scripted",
      language: "English",
      status: "Ended",
      premiered: "2008-01-20",
      ended: "2013-09-29",
      weight: 99,
      source_genres: ["Drama", "Crime"],
      image_url: "https://example.com/bb.jpg",
      summary: "A chemistry teacher turns to crime.",
      watched: true,
    });
  });

  it("defaults missing genres to an empty array", () => {
    expect(
      mapShowRow(
        { ...showRow, source_genres: undefined as unknown as string[] },
        false,
      ).source_genres,
    ).toEqual([]);
  });
});
