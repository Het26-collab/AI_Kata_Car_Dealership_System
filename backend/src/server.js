import { execSync } from "child_process";
import { app } from "./app.js";

const PORT = process.env.PORT || 4000;

// Ensure database tables exist and are seeded automatically on production startup
try {
  console.log("🛠️ Initializing database schema...");
  execSync("npx prisma db push --skip-generate", { stdio: "inherit" });
  console.log("🌱 Seeding database with initial records...");
  execSync("node prisma/seed.js", { stdio: "inherit" });
} catch (err) {
  console.warn("⚠️ Database initialization warning:", err.message);
}

app.listen(PORT, () => {
  console.log(`DriveFlow backend listening on port ${PORT}`);
});
