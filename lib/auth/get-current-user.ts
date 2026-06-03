import "server-only";

import { cookies } from "next/headers";

import { createSupabaseAdminClient } from "@/utils/supabase/admin";

import { SESSION_COOKIE_NAME } from "./constants";
import { hashSessionToken } from "./hash-token";

export type CurrentUser = {
  id: number;
  name: string;
  email: string;
};

export async function destroySession(rawToken: string) {
  const supabase = createSupabaseAdminClient();
  await supabase
    .from("sessions")
    .delete()
    .eq("token_hash", hashSessionToken(rawToken));
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const tokenHash = hashSessionToken(token);
  const supabase = createSupabaseAdminClient();

  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .select("user_id, expires_at")
    .eq("token_hash", tokenHash)
    .maybeSingle();

  if (sessionError || !session) {
    return null;
  }

  if (new Date(session.expires_at).getTime() < Date.now()) {
    await supabase.from("sessions").delete().eq("token_hash", tokenHash);
    return null;
  }

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id, name, email")
    .eq("id", session.user_id)
    .maybeSingle();

  if (userError || !user) {
    return null;
  }

  return user;
}
