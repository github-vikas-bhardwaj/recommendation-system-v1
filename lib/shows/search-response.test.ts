import { describe, expect, it } from "vitest";

import type { Show } from "@/lib/shows/types";

import { toSearchResultShow } from "./search-response";

const show: Show = {
  id: 7,
  name: "The Wire",
  type: "Scripted",
  language: "English",
  status: "Ended",
  premiered: "2002-06-02",
  ended: "2008-03-09",
  weight: 95,
  source_genres: ["Crime", "Drama"],
  image_url: "https://example.com/wire.jpg",
  summary: "Baltimore drug trade investigation.",
  watched: false,
};

describe("toSearchResultShow", () => {
  it("returns only search result fields", () => {
    expect(toSearchResultShow(show)).toEqual({
      id: 7,
      name: "The Wire",
      source_genres: ["Crime", "Drama"],
      image_url: "https://example.com/wire.jpg",
      watched: false,
    });
  });
});
