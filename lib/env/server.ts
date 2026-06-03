import "server-only";

import { getAppEnvConfig } from "./app";

export function getSupabaseServiceRoleKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const { appEnv, supabaseProjectHint } = getAppEnvConfig();

  if (!key) {
    throw new Error(
      `Missing SUPABASE_SERVICE_ROLE_KEY (APP_ENV=${appEnv}). Use the service_role secret from ${supabaseProjectHint}. See docs/environments.md.`,
    );
  }

  return key;
}
