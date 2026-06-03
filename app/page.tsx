import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/get-current-user";

export default async function Home() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/shows?page=1");
  }

  return (
    <section className="relative mx-auto flex w-full flex-1 flex-col items-center justify-center px-6 py-20 text-center">
      <div className="relative z-20 flex flex-col items-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
          Welcome
        </p>
        <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Build personalized recommendations faster.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          Start by signing in to your account, or create one to save preferences
          and manage your recommendations.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/auth/sign-in"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-300 px-6 text-sm font-semibold transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Continue to sign in
          </Link>
          <Link
            href="/auth/sign-up"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-violet-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
          >
            Create an account
          </Link>
        </div>
      </div>
    </section>
  );
}
