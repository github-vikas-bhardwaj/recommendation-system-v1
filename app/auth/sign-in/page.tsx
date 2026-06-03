import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/get-current-user";

import { AuthCard } from "../auth-card";
import { AuthScreen } from "../auth-screen";
import { SignInForm } from "../sign-in-form";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function AuthSignInPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/shows?page=1");
  }

  return (
    <AuthScreen>
      <AuthCard active="signin">
        <SignInForm />
      </AuthCard>
    </AuthScreen>
  );
}
