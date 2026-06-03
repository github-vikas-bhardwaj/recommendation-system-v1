import "server-only";

import { cookies } from "next/headers";

import { usesSecureCookies } from "@/lib/env/app";
import { createSupabaseAdminClient } from "@/utils/supabase/admin";

import { SESSION_COOKIE_NAME, SESSION_DURATION_SECONDS } from "./constants";
import {
  createUserSession,
  destroyUserSession,
} from "./services/session.service";
import type { SessionCookieOptions } from "./types";

function sessionCookieOptions(): SessionCookieOptions {
  return {
    httpOnly: true,
    secure: usesSecureCookies(),
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  };
}

export async function createSession(userId: number) {
  const supabase = createSupabaseAdminClient();
  const cookieStore = await cookies();

  await createUserSession(userId, {
    insertSession: async (session) => {
      const { error } = await supabase.from("sessions").insert(session);
      if (error) {
        throw new Error(`Failed to create session: ${error.message}`);
      }
    },
    setSessionCookie: (token) => {
      cookieStore.set(SESSION_COOKIE_NAME, token, sessionCookieOptions());
    },
  });
}

export async function destroySession(rawToken: string) {
  const supabase = createSupabaseAdminClient();

  await destroyUserSession(rawToken, {
    deleteSessionByHash: async (tokenHash) => {
      await supabase.from("sessions").delete().eq("token_hash", tokenHash);
    },
  });
}
