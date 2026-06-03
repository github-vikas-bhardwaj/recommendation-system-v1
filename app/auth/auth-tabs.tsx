import Link from "next/link";

import type { AuthMode } from "./types";

const tabLinkClass = (active: boolean) =>
  `flex items-center justify-center rounded-xl px-4 py-2.5 text-center text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-900 ${
    active
      ? "bg-zinc-900 text-white shadow-sm dark:bg-white dark:text-zinc-900"
      : "text-zinc-600 hover:bg-zinc-100/80 dark:text-zinc-400 dark:hover:bg-white/5"
  }`;

export function AuthTabs({ active }: { active: AuthMode }) {
  return (
    <nav aria-label="Sign in or sign up" className="grid grid-cols-2 gap-1 p-1">
      <Link
        href="/auth/sign-in"
        aria-current={active === "signin" ? "page" : undefined}
        className={tabLinkClass(active === "signin")}
      >
        Sign in
      </Link>
      <Link
        href="/auth/sign-up"
        aria-current={active === "signup" ? "page" : undefined}
        className={tabLinkClass(active === "signup")}
      >
        Create account
      </Link>
    </nav>
  );
}
