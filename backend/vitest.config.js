import { defineConfig } from "vitest/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    name: "backend",
    root: __dirname,
    include: ["tests/**/*.test.js"],
    fileParallelism: false,
    setupFiles: [path.resolve(__dirname, "tests/setup.js")],
  },
});
