import "server-only";

import { createClient } from "@supabase/supabase-js";

import { getSupabaseServiceRoleKey } from "@/lib/env/server";
import { getSupabasePublicEnv } from "@/lib/env/supabase-public";

/** Bypasses RLS — server actions and scripts. Never import from Client Components. */
export function createSupabaseAdminClient() {
  const { url } = getSupabasePublicEnv();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
