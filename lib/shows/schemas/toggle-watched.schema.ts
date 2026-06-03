import { z } from "zod";

export const toggleShowWatchedSchema = z.object({
  showId: z.coerce.number().int().positive(),
  watched: z.enum(["true", "false"]).transform((v) => v === "true"),
});

export type ToggleShowWatchedInput = z.infer<typeof toggleShowWatchedSchema>;

export type ToggleShowWatchedFieldErrors = z.inferFlattenedErrors<
  typeof toggleShowWatchedSchema
>["fieldErrors"];
