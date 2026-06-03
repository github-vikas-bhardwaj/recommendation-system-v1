import type { SupabaseClient } from "@supabase/supabase-js";

export async function findShowById(
  showId: number,
  supabase: SupabaseClient,
): Promise<number | null> {
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
