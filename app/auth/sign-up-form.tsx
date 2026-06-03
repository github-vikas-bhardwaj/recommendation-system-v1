"use client";

import { useActionState } from "react";

import { signUp } from "@/app/actions/sign-up";

import { AuthInput } from "./auth-input";

export function SignUpForm() {
  const [state, formAction, pending] = useActionState(signUp, null);

  return (
    <form className="flex flex-col gap-4" action={formAction}>
      <AuthInput
        id="signup-name"
        name="name"
        label="Full name"
        type="text"
        autoComplete="name"
        required
        placeholder="Jane Doe"
        defaultValue={state?.values?.name ?? ""}
      />
      {state?.fieldErrors?.name?.[0] ? (
        <p className="text-sm text-red-500">{state.fieldErrors.name[0]}</p>
      ) : null}
      <AuthInput
        id="signup-email"
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        required
        placeholder="you@example.com"
        defaultValue={state?.values?.email ?? ""}
      />
      {state?.fieldErrors?.email?.[0] ? (
        <p className="text-sm text-red-500">{state.fieldErrors.email[0]}</p>
      ) : null}
      {state?.message && !state.fieldErrors ? (
        <p className="text-sm text-red-500">{state.message}</p>
      ) : null}
      <AuthInput
        id="signup-password"
        name="password"
        label="Password"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        maxLength={256}
        placeholder="At least 8 characters"
      />
      <AuthInput
        id="signup-confirm"
        name="confirm"
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        maxLength={256}
        placeholder="Repeat password"
      />
      {state?.fieldErrors?.confirm?.[0] ? (
        <p className="text-sm text-red-500">{state.fieldErrors.confirm[0]}</p>
      ) : null}
      <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-500">
        By creating an account you agree to our terms and acknowledge the
        privacy policy.
      </p>
      <button
        type="submit"
        disabled={pending}
        className="mt-1 flex h-11 w-full items-center justify-center rounded-xl bg-violet-600 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 outline-none transition-colors hover:bg-violet-500 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:bg-violet-600/50 disabled:shadow-none dark:shadow-violet-900/30 dark:focus-visible:ring-offset-zinc-900"
      >
        {pending ? "Creating..." : "Create account"}
      </button>
    </form>
  );
}
