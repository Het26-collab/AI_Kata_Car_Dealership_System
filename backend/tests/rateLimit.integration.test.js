import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app.js";

describe("Rate Limiting Layer", () => {
  it("triggers 429 Too Many Requests after exceeding threshold on POST /api/auth/login", async () => {
    const attempts = 21;
    let lastRes;

    for (let i = 0; i < attempts; i++) {
      lastRes = await request(app)
        .post("/api/auth/login")
        .send({ email: "rate-limit-test@example.com", password: "wrongpassword" });
    }

    expect(lastRes.status).toBe(429);
    expect(lastRes.body).toHaveProperty("error");
    expect(lastRes.body.error).toMatch(/too many requests/i);
  });
});
