import type { ReactNode } from "react";

export function AuthScreen({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-full flex-1 flex-col items-center justify-center px-4 py-16 font-sans">
      <main className="relative z-10 mx-auto grid w-full items-start gap-10 md:grid-cols-[minmax(0,1fr)_420px]">
        <section className="flex flex-col text-zinc-900 dark:text-zinc-50">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
            Recommendation platform
          </p>
          <h1 className="mt-3 max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Personalize what every user sees.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Sign in to continue where you left off, or create a new account to
            start curating recommendations with confidence.
          </p>

          <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-zinc-200/80 bg-white/80 px-4 py-3 text-sm text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300">
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                Fast onboarding
              </p>
              <p className="mt-1 text-xs leading-relaxed">
                Get started in seconds with simple auth flows.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200/80 bg-white/80 px-4 py-3 text-sm text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300">
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                Secure by design
              </p>
              <p className="mt-1 text-xs leading-relaxed">
                Built for modern security expectations and trust.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200/80 bg-white/80 px-4 py-3 text-sm text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300 sm:col-span-2">
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                Smarter recommendations
              </p>
              <p className="mt-1 text-xs leading-relaxed">
                Save preferences and continuously improve user relevance over
                time.
              </p>
            </div>
          </div>
        </section>

        <section className="w-full">
          {children}
          <p className="mt-6 text-center text-xs text-zinc-500 dark:text-zinc-500">
            Passwords are hashed with Argon2id. Sessions are stored server-side
            in Supabase.
          </p>
        </section>
      </main>
    </div>
  );
}
