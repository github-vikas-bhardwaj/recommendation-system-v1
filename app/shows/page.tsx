import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/get-current-user";

type PageProps = {
  searchParams: Promise<{ page?: string }>;
};

/** Placeholder until the shows browse UI is ported. */
export default async function ShowsPage({ searchParams }: PageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/sign-in");
  }

  const { page: pageParam } = await searchParams;
  const pageStr = Array.isArray(pageParam) ? pageParam[0] : pageParam;
  if (pageStr === undefined || pageStr === "") {
    redirect("/shows?page=1");
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Shows</h1>
      <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
        Signed in as {user.name}. The catalog grid is coming in the next chunk.
      </p>
    </div>
  );
}
