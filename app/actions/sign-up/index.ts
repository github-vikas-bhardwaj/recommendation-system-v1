"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { hashPassword } from "@/lib/auth/password";
import { signUpUser } from "@/lib/auth/services/sign-up.service";
import { createSession } from "@/lib/auth/session";
import { insertUser } from "@/lib/db";
import { usesSecureCookies } from "@/lib/env/app";

type SignUpValues = {
  name: string;
  email: string;
};

type SignUpState = {
  success: false;
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
  values?: SignUpValues;
} | null;

export async function signUp(
  _prev: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  const result = await signUpUser(
    {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: formData.get("password"),
      confirm: formData.get("confirm"),
    },
    { hashPassword, insertUser },
  );

  if (result.kind === "validation") {
    return {
      success: false,
      message: result.message,
      fieldErrors: result.fieldErrors,
      values: result.values,
    };
  }

  if (result.kind === "db_error") {
    return {
      success: false,
      message: result.message,
      values: result.values,
    };
  }

  await createSession(result.userId);

  (await cookies()).set("flash", "Welcome! Your account is ready.", {
    maxAge: 10,
    httpOnly: false,
    path: "/",
    sameSite: "lax",
    secure: usesSecureCookies(),
  });

  redirect("/shows?page=1");
}
