"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { findUserByEmail } from "@/lib/db";
import { usesSecureCookies } from "@/lib/env/app";

import { signInSchema } from "./schema";

type SignInValues = { email: string };
type SignInState = {
  success: false;
  message: string;
  fieldErrors?: z.inferFlattenedErrors<typeof signInSchema>["fieldErrors"];
  values?: SignInValues;
} | null;

export async function signIn(
  _prev: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const rawValues = {
    email: String(formData.get("email") ?? ""),
  };

  const parsed = signInSchema.safeParse({
    ...rawValues,
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
      values: rawValues,
    };
  }

  const user = await findUserByEmail(parsed.data.email);
  if (!user) {
    return {
      success: false,
      message: "Wrong credentials! Please try again.",
    };
  }

  const isValidPassword = await verifyPassword(
    user.password_hash,
    parsed.data.password,
  );

  if (!isValidPassword) {
    return {
      success: false,
      message: "Wrong credentials! Please try again.",
      values: rawValues,
    };
  }

  await createSession(user.id);
  (await cookies()).set("flash", "Welcome back!", {
    maxAge: 10,
    httpOnly: false,
    path: "/",
    sameSite: "lax",
    secure: usesSecureCookies(),
  });
  redirect("/shows?page=1");
}
