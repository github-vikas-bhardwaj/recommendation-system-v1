import "server-only";

import { createSupabaseAdminClient } from "@/utils/supabase/admin";

export type UserWithPassword = {
  id: number;
  name: string;
  email: string;
  password_hash: string;
};

type InsertUserInput = {
  name: string;
  email: string;
  passwordHash: string;
};

type InsertUserResult =
  | { success: true; userId: number }
  | { success: false; reason: "EMAIL_TAKEN" | "UNKNOWN" };

export async function findUserByEmail(
  email: string,
): Promise<UserWithPassword | null> {
  const supabase = createSupabaseAdminClient();
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
): Promise<InsertUserResult> {
  const supabase = createSupabaseAdminClient();
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
