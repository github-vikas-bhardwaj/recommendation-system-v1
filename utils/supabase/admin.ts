import "server-only";

import { createClient } from "@supabase/supabase-js";

import { getSupabaseEnv } from "@/utils/supabase/env";

/** Bypasses RLS — seed/scripts only. Never import from Client Components. */
export function createSupabaseAdminClient() {
  const { url } = getSupabaseEnv();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY in .env.local. Add it from Supabase Dashboard → Project Settings → API → service_role (secret), then restart the dev server.",
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
