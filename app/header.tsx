import Link from "next/link";

export function Header() {
  return (
    <header className="relative z-20 overflow-hidden bg-transparent">
      <div className="relative z-10 mx-auto flex w-full items-center justify-between px-6 py-4">
        <Link href="/" className="text-base font-semibold tracking-tight">
          Recommendation System
        </Link>
        <nav className="flex items-center gap-3">
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
        </nav>
      </div>
    </header>
  );
}
