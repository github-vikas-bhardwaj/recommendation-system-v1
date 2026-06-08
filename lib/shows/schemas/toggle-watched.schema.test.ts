import { describe, expect, it } from "vitest";

import { toggleShowWatchedSchema } from "./toggle-watched.schema";

describe("toggleShowWatchedSchema", () => {
  it("parses valid watched payload", () => {
    const result = toggleShowWatchedSchema.safeParse({
      showId: "42",
      watched: "true",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ showId: 42, watched: true });
    }
  });

  it("parses false watched payload", () => {
    const result = toggleShowWatchedSchema.safeParse({
      showId: 7,
      watched: "false",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ showId: 7, watched: false });
    }
  });

  it("rejects invalid show id", () => {
    const result = toggleShowWatchedSchema.safeParse({
      showId: "0",
      watched: "true",
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid watched value", () => {
    const result = toggleShowWatchedSchema.safeParse({
      showId: "1",
      watched: "yes",
    });

    expect(result.success).toBe(false);
  });
});
