import { cookies } from "next/headers";

import { FlashToast } from "./flash-toast";

export async function FlashFromCookie() {
  const flash = (await cookies()).get("flash")?.value;
  if (!flash) return null;
  return <FlashToast message={flash} id={flash} />;
}
