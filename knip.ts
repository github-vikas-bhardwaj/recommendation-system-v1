import type { KnipConfig } from "knip";

const config: KnipConfig = {
  // Installed for ESLint; enable in eslint.config.mjs (e.g. eslint-config-prettier) then remove this.
  ignoreDependencies: ["eslint-config-prettier"],
  ignoreFiles: ["utils/supabase/client.ts"],
  // Barrel re-exports and public Show type alias (used by app code; knip does not trace all consumers)
  ignoreIssues: {
    "lib/db/index.ts": ["exports"],
    "app/shows/show-card.tsx": ["types"],
  },
};

export default config;
