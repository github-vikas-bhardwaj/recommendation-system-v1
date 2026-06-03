import "server-only";

import { cookies } from "next/headers";

import { createSupabaseAdminClient } from "@/utils/supabase/admin";

import { SESSION_COOKIE_NAME } from "./constants";
import { resolveCurrentUser } from "./services/current-user.service";
import type { CurrentUser } from "./types";

export type { CurrentUser };

export { destroySession } from "./session";

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const supabase = createSupabaseAdminClient();

  return resolveCurrentUser(token, {
    findSessionByHash: async (tokenHash) => {
      const { data, error } = await supabase
        .from("sessions")
        .select("user_id, expires_at")
        .eq("token_hash", tokenHash)
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      return data;
    },
    findUserById: async (userId) => {
      const { data, error } = await supabase
        .from("users")
        .select("id, name, email")
        .eq("id", userId)
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      return data;
    },
    deleteSessionByHash: async (tokenHash) => {
      await supabase.from("sessions").delete().eq("token_hash", tokenHash);
    },
  });
}
