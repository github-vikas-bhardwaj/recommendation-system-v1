"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { hashPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { insertUser } from "@/lib/db";
import { usesSecureCookies } from "@/lib/env/app";

import { signUpSchema } from "./schema";

type SignUpValues = {
  name: string;
  email: string;
};

type SignUpState = {
  success: false;
  message: string;
  fieldErrors?: z.inferFlattenedErrors<typeof signUpSchema>["fieldErrors"];
  values?: SignUpValues;
} | null;

const dbErrorMessages: Record<"EMAIL_TAKEN" | "UNKNOWN", string> = {
  EMAIL_TAKEN: "An account with this email already exists.",
  UNKNOWN: "Something went wrong. Please try again.",
};

export async function signUp(
  _prev: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  const rawValues = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
  };

  const parsed = signUpSchema.safeParse({
    ...rawValues,
    password: formData.get("password"),
    confirm: formData.get("confirm"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
      values: rawValues,
    };
  }

  const passwordHash = await hashPassword(parsed.data.password);

  const res = await insertUser({
    name: parsed.data.name,
    email: parsed.data.email,
    passwordHash,
  });

  if (!res.success) {
    return {
      success: false,
      message: dbErrorMessages[res.reason],
      values: rawValues,
    };
  }

  await createSession(res.userId);

  (await cookies()).set("flash", "Welcome! Your account is ready.", {
    maxAge: 10,
    httpOnly: false,
    path: "/",
    sameSite: "lax",
    secure: usesSecureCookies(),
  });

  redirect("/shows?page=1");
}
