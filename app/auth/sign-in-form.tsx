"use client";

import { useActionState } from "react";

import { signIn } from "@/app/actions/sign-in";

import { AuthInput } from "./auth-input";

export function SignInForm() {
  const [state, formAction, pending] = useActionState(signIn, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <AuthInput
        id="signin-email"
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        required
        placeholder="you@example.com"
        defaultValue={state?.values?.email ?? ""}
      />
      <AuthInput
        id="signin-password"
        name="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        required
        placeholder="••••••••"
      />
      {!state?.success ? (
        <p className="text-sm text-red-500">{state?.message}</p>
      ) : null}
      <button
        type="submit"
        className="mt-1 flex h-11 w-full items-center justify-center rounded-xl bg-violet-600 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 outline-none transition-colors hover:bg-violet-500 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60 dark:shadow-violet-900/30 dark:focus-visible:ring-offset-zinc-900"
        disabled={pending}
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
