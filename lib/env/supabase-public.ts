import { getAppEnvConfig } from "./app";

export function hasPublicSupabaseEnv(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}

export function getSupabasePublicEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const { appEnv, supabaseProjectHint } = getAppEnvConfig();

  if (!url || !key) {
    throw new Error(
      `Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (APP_ENV=${appEnv}). Use keys from ${supabaseProjectHint}. See docs/environments.md.`,
    );
  }

  return { url, key };
}
