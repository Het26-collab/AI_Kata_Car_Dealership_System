import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeEach } from "vitest";

const testsDir = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(testsDir, "..");
const prismaSchemaPath = path.resolve(backendRoot, "prisma", "schema.prisma");
const workerId = process.env.VITEST_POOL_ID ?? process.env.VITEST_WORKER_ID ?? "0";
const dbDir = path.resolve(backendRoot, ".tmp", "test-dbs");
const dbPath = path.resolve(dbDir, `test-worker-${workerId}.db`);

process.env.DATABASE_URL = `file:${dbPath.replace(/\\/g, "/")}`;
process.env.JWT_SECRET = "test-jwt-secret";

fs.mkdirSync(dbDir, { recursive: true });

if (!fs.existsSync(dbPath)) {
  execSync(
    `npx prisma db push --skip-generate --schema "${prismaSchemaPath}"`,
    {
      cwd: backendRoot,
      stdio: "pipe",
      env: process.env,
    },
  );
} else {
  // Push schema to make sure any new models are created in worker dbs
  try {
    execSync(
      `npx prisma db push --skip-generate --schema "${prismaSchemaPath}"`,
      {
        cwd: backendRoot,
        stdio: "pipe",
        env: process.env,
      },
    );
  } catch (err) {}
}

const { prisma } = await import("../src/lib/prisma.js");

beforeEach(async () => {
  await prisma.purchase.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  if (prisma) {
    await prisma.purchase.deleteMany();
    await prisma.vehicle.deleteMany();
    await prisma.user.deleteMany();
  }
});
