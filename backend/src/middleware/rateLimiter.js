import rateLimit from "express-rate-limit";

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "test" ? 20 : 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many authentication requests. Please wait a few minutes before trying again.",
  },
  statusCode: 429,
});
