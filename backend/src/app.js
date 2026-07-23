import express from "express";
import cors from "cors";
import vehiclesRouter from "./routes/vehicles.routes.js";
import authRouter from "./routes/auth.routes.js";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "driveflow-backend", time: new Date().toISOString() });
});

app.use("/api/auth", authRouter);
app.use("/api/vehicles", vehiclesRouter);

app.use(notFoundHandler);
app.use(errorHandler);
