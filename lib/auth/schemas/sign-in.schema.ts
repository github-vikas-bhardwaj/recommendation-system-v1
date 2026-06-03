import { z } from "zod";

export const signInSchema = z.object({
  email: z.email("Invalid email").trim().toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export type SignInInput = z.infer<typeof signInSchema>;

export type SignInFieldErrors = z.inferFlattenedErrors<
  typeof signInSchema
>["fieldErrors"];
