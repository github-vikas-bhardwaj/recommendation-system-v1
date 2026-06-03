import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/get-current-user";

export default async function RecommendationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/sign-in");
  }

  return children;
}
