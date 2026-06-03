"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { verifyPassword } from "@/lib/auth/password";
import { signInUser } from "@/lib/auth/services/sign-in.service";
import { createSession } from "@/lib/auth/session";
import { findUserByEmail } from "@/lib/db";
import { usesSecureCookies } from "@/lib/env/app";

type SignInValues = { email: string };
type SignInState = {
  success: false;
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
  values?: SignInValues;
} | null;

export async function signIn(
  _prev: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const result = await signInUser(
    {
      email: String(formData.get("email") ?? ""),
      password: formData.get("password"),
    },
    { findUserByEmail, verifyPassword },
  );

  if (result.kind === "validation") {
    return {
      success: false,
      message: result.message,
      fieldErrors: result.fieldErrors,
      values: result.values,
    };
  }

  if (result.kind === "invalid_credentials") {
    return {
      success: false,
      message: result.message,
      ...(result.values ? { values: result.values } : {}),
    };
  }

  await createSession(result.userId);

  (await cookies()).set("flash", "Welcome back!", {
    maxAge: 10,
    httpOnly: false,
    path: "/",
    sameSite: "lax",
    secure: usesSecureCookies(),
  });

  redirect("/shows?page=1");
}
