import type { UserWithPassword } from "@/lib/db/types";

import {
  signInSchema,
  type SignInFieldErrors,
} from "../schemas/sign-in.schema";

export type SignInUserDeps = {
  findUserByEmail: (email: string) => Promise<UserWithPassword | null>;
  verifyPassword: (hash: string, password: string) => Promise<boolean>;
};

export type SignInValidationFailure = {
  kind: "validation";
  message: string;
  fieldErrors: SignInFieldErrors;
  values: { email: string };
};

export type SignInInvalidCredentialsFailure = {
  kind: "invalid_credentials";
  message: string;
  values?: { email: string };
};

export type SignInSuccess = {
  kind: "success";
  userId: number;
};

export type SignInResult =
  | SignInSuccess
  | SignInValidationFailure
  | SignInInvalidCredentialsFailure;

export async function signInUser(
  raw: { email: string; password: unknown },
  deps: SignInUserDeps,
): Promise<SignInResult> {
  const values = { email: raw.email };

  const parsed = signInSchema.safeParse({
    email: raw.email,
    password: raw.password,
  });

  if (!parsed.success) {
    return {
      kind: "validation",
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
      values,
    };
  }

  const user = await deps.findUserByEmail(parsed.data.email);
  if (!user) {
    return {
      kind: "invalid_credentials",
      message: "Wrong credentials! Please try again.",
    };
  }

  const isValidPassword = await deps.verifyPassword(
    user.password_hash,
    parsed.data.password,
  );

  if (!isValidPassword) {
    return {
      kind: "invalid_credentials",
      message: "Wrong credentials! Please try again.",
      values,
    };
  }

  return { kind: "success", userId: user.id };
}
