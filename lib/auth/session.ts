import "server-only";

import { cookies } from "next/headers";

import { createSupabaseAdminClient } from "@/utils/supabase/admin";

import { SESSION_COOKIE_NAME, SESSION_DURATION_SECONDS } from "./constants";
import { generateSessionToken, hashSessionToken } from "./hash-token";

export async function createSession(userId: number) {
  const token = generateSessionToken();
  const tokenHash = hashSessionToken(token);
  const expiresAt = new Date(
    Date.now() + SESSION_DURATION_SECONDS * 1000,
  ).toISOString();

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("sessions").insert({
    token_hash: tokenHash,
    user_id: userId,
    expires_at: expiresAt,
  });

  if (error) {
    throw new Error(`Failed to create session: ${error.message}`);
  }

  (await cookies()).set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}
