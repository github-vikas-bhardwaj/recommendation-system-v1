import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/get-current-user";
import { searchShowsForUser } from "@/lib/db";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";

  const shows = await searchShowsForUser(user.id, q, 10);

  return NextResponse.json({
    shows: shows.map(({ id, name, source_genres, image_url, watched }) => ({
      id,
      name,
      source_genres,
      image_url,
      watched,
    })),
  });
}
