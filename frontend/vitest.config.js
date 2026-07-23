import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: {
    name: "frontend",
    root: __dirname,
    environment: "jsdom",
    include: ["src/**/*.test.tsx"],
    setupFiles: [path.resolve(__dirname, "src/test/setup.ts")],
    globals: true,
  },
});
