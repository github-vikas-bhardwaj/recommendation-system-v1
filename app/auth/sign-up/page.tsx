import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/get-current-user";

import { AuthCard } from "../auth-card";
import { AuthScreen } from "../auth-screen";
import { SignUpForm } from "../sign-up-form";

export const metadata: Metadata = {
  title: "Sign up",
};

export default async function AuthSignUpPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/shows?page=1");
  }

  return (
    <AuthScreen>
      <AuthCard active="signup">
        <SignUpForm />
      </AuthCard>
    </AuthScreen>
  );
}
