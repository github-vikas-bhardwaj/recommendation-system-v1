import type { AppEnvironment, AppEnvConfig } from "./types";

const VALID_APP_ENVS: AppEnvironment[] = ["local", "testing", "production"];

function isAppEnvironment(value: string): value is AppEnvironment {
  return VALID_APP_ENVS.includes(value as AppEnvironment);
}

/**
 * Resolves logical app environment. Prefer explicit APP_ENV in every deploy target.
 *
 * Fallback when APP_ENV is unset:
 * - not on Vercel → local
 * - VERCEL_ENV=production → production (set APP_ENV=testing on the testing Vercel project)
 * - otherwise → testing
 */
export function getAppEnvironment(): AppEnvironment {
  const explicit = process.env.APP_ENV?.trim().toLowerCase();
  if (explicit && isAppEnvironment(explicit)) {
    return explicit;
  }

  if (!process.env.VERCEL) {
    return "local";
  }

  if (process.env.VERCEL_ENV === "production") {
    return "production";
  }

  return "testing";
}

export function getAppEnvConfig(): AppEnvConfig {
  const appEnv = getAppEnvironment();

  return {
    appEnv,
    isLocal: appEnv === "local",
    isTesting: appEnv === "testing",
    isProduction: appEnv === "production",
    supabaseProjectHint:
      appEnv === "production"
        ? "recommendation-system-v1 (production Supabase)"
        : "recommendation-system-testing-v1 (local & testing Supabase)",
  };
}

/** HTTPS-only session/flash cookies everywhere except local dev. */
export function usesSecureCookies(): boolean {
  return getAppEnvironment() !== "local";
}
