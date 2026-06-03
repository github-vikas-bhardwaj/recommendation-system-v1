import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import { getSupabasePublicEnv, hasPublicSupabaseEnv } from "@/lib/env";

export async function updateSupabaseSession(request: NextRequest) {
  // Custom session auth does not use Supabase Auth; skip when env is unset.
  if (!hasPublicSupabaseEnv()) {
    return NextResponse.next({
      request: { headers: request.headers },
    });
  }

  const { url, key } = getSupabasePublicEnv();

  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  await supabase.auth.getUser();

  return supabaseResponse;
}
