import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts"],
    exclude: ["node_modules", "dist", "build", "out", ".next"],
    coverage: {
      provider: "v8",
      include: ["lib/**/*.ts"],
      exclude: ["**/*.test.ts", "**/*.spec.ts"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
