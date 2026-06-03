import { z } from "zod";

export const signUpSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(100),
    email: z.string().trim().toLowerCase().email("Invalid email"),
    password: z.string().min(8, "Min 8 characters").max(256),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });
