import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/get-current-user";

export default async function AuthPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/shows?page=1");
  }
  redirect("/auth/sign-in");
}
