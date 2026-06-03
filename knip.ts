import type { KnipConfig } from "knip";

const config: KnipConfig = {
  // Installed for ESLint; enable in eslint.config.mjs (e.g. eslint-config-prettier) then remove this.
  ignoreDependencies: ["eslint-config-prettier"],
  ignoreFiles: ["utils/supabase/client.ts", "utils/supabase/server.ts"],
};

export default config;
