import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  InsertUserInput,
  InsertUserResult,
  UserWithPassword,
} from "@/lib/db/types";

export async function findUserByEmail(
  email: string,
  supabase: SupabaseClient,
): Promise<UserWithPassword | null> {
  const { data, error } = await supabase
    .from("users")
    .select("id, name, email, password_hash")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    console.error("findUserByEmail failed", error.message);
    return null;
  }

  return data ?? null;
}

export async function insertUser(
  user: InsertUserInput,
  supabase: SupabaseClient,
): Promise<InsertUserResult> {
  const { data, error } = await supabase
    .from("users")
    .insert({
      name: user.name,
      email: user.email,
      password_hash: user.passwordHash,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { success: false, reason: "EMAIL_TAKEN" };
    }
    console.error("insertUser failed", error.message);
    return { success: false, reason: "UNKNOWN" };
  }

  return { success: true, userId: data.id };
}
