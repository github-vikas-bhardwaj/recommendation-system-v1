import type { ReactNode } from "react";

import { AuthTabs } from "./auth-tabs";
import type { AuthMode } from "./types";

export function AuthCard({
  active,
  children,
}: {
  active: AuthMode;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white/80 p-1 shadow-xl shadow-zinc-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/75 dark:shadow-black/40">
      <AuthTabs active={active} />
      <div className="border-t border-zinc-100 px-6 pb-6 pt-2 dark:border-white/10">
        <div className="pt-4">{children}</div>
      </div>
    </div>
  );
}
