import type { InsertUserResult } from "@/lib/db/types";

import {
  signUpSchema,
  type SignUpFieldErrors,
  type SignUpFormValues,
} from "../schemas/sign-up.schema";

const dbErrorMessages: Record<"EMAIL_TAKEN" | "UNKNOWN", string> = {
  EMAIL_TAKEN: "An account with this email already exists.",
  UNKNOWN: "Something went wrong. Please try again.",
};

export type SignUpUserDeps = {
  hashPassword: (password: string) => Promise<string>;
  insertUser: (input: {
    name: string;
    email: string;
    passwordHash: string;
  }) => Promise<InsertUserResult>;
};

export type SignUpValidationFailure = {
  kind: "validation";
  message: string;
  fieldErrors: SignUpFieldErrors;
  values: SignUpFormValues;
};

export type SignUpDbFailure = {
  kind: "db_error";
  message: string;
  values: SignUpFormValues;
};

export type SignUpSuccess = {
  kind: "success";
  userId: number;
};

export type SignUpResult =
  | SignUpSuccess
  | SignUpValidationFailure
  | SignUpDbFailure;

export async function signUpUser(
  raw: {
    name: string;
    email: string;
    password: unknown;
    confirm: unknown;
  },
  deps: SignUpUserDeps,
): Promise<SignUpResult> {
  const values: SignUpFormValues = {
    name: raw.name,
    email: raw.email,
  };

  const parsed = signUpSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      kind: "validation",
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
      values,
    };
  }

  const passwordHash = await deps.hashPassword(parsed.data.password);
  const res = await deps.insertUser({
    name: parsed.data.name,
    email: parsed.data.email,
    passwordHash,
  });

  if (!res.success) {
    return {
      kind: "db_error",
      message: dbErrorMessages[res.reason],
      values,
    };
  }

  return { kind: "success", userId: res.userId };
}
