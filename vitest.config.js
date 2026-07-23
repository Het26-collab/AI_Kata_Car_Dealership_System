import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      "backend/vitest.config.js",
      "frontend/vitest.config.js",
    ],
  },
});
