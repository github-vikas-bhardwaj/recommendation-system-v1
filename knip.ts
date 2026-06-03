import type { KnipConfig } from "knip";

const config: KnipConfig = {
  // Installed for ESLint; enable in eslint.config.mjs (e.g. eslint-config-prettier) then remove this.
  ignoreDependencies: ["eslint-config-prettier"],
  ignoreFiles: ["utils/supabase/client.ts"],
  // Barrel re-exports and public Show type alias (used by app code; knip does not trace all consumers)
  ignoreIssues: {
    "lib/db/index.ts": ["exports", "types"],
    "lib/db/types.ts": ["types"],
    "lib/auth/schemas/*.ts": ["types"],
    "lib/auth/services/*.ts": ["types"],
    "lib/auth/types.ts": ["types"],
    "lib/shows/schemas/*.ts": ["types"],
    "lib/shows/services/*.ts": ["types"],
    "lib/shows/pagination.ts": ["exports"],
    "lib/shows/search-response.ts": ["types"],
    "lib/env/app.ts": ["exports"],
    "lib/env/index.ts": ["exports", "types"],
    "app/shows/show-card.tsx": ["types"],
  },
};

export default config;
