import Link from "next/link";

import { signOut } from "@/app/actions/sign-out";
import { getCurrentUser } from "@/lib/auth/get-current-user";

import User from "./auth/user";

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="relative z-20 overflow-hidden bg-transparent">
      <div className="relative z-10 mx-auto flex w-full items-center justify-between px-6 py-4">
        <Link
          href={user ? "/shows?page=1" : "/"}
          className="text-base font-semibold tracking-tight"
        >
          Recommendation System
        </Link>
        <nav className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/shows?page=1"
                className="rounded-full px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
              >
                Shows
              </Link>
              <form action={signOut}>
                <User name={user.name} />
              </form>
            </>
          ) : (
            <>
              <Link
                href="/auth/sign-in"
                className="rounded-full px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
              >
                Sign in
              </Link>
              <Link
                href="/auth/sign-up"
                className="rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
