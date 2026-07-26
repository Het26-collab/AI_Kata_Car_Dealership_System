import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import vehiclesRouter from "./routes/vehicles.routes.js";
import authRouter from "./routes/auth.routes.js";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";

export const app = express();

// ─── Security headers ──────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false, // Allow inline styles from Tailwind
  })
);

// ─── Response compression ───────────────────────────────────────────────────
app.use(compression());

// ─── Request logging (skip in test environment) ─────────────────────────────
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("short"));
}

// ─── CORS ───────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ─── Body parsing ───────────────────────────────────────────────────────────
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// ─── Welcome / Root route ───────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the DriveFlow API. Please use /api/health to check service status, or connect via the frontend.",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      vehicles: "/api/vehicles"
    }
  });
});

// ─── Health check ───────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "driveflow-backend",
    version: "2.0.0",
    uptime: Math.floor(process.uptime()),
    time: new Date().toISOString(),
    env: process.env.NODE_ENV || "development",
  });
});

// ─── API routes ─────────────────────────────────────────────────────────────
app.use("/api/auth", authRouter);
app.use("/api/vehicles", vehiclesRouter);

// ─── Error handling ─────────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);
