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

export type SignUpInput = z.infer<typeof signUpSchema>;

export type SignUpFieldErrors = z.inferFlattenedErrors<
  typeof signUpSchema
>["fieldErrors"];

export type SignUpFormValues = {
  name: string;
  email: string;
};
