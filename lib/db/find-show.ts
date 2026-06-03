import "server-only";

import { createSupabaseAdminClient } from "@/utils/supabase/admin";

export async function findShowById(showId: number): Promise<number | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("shows")
    .select("id")
    .eq("id", showId)
    .maybeSingle();

  if (error) {
    throw new Error(`findShowById: ${error.message}`);
  }

  return data?.id ?? null;
}
