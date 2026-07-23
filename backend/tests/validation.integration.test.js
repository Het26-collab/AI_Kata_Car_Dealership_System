import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app.js";
import { createAuthHeader } from "./helpers.js";

describe("Input Validation Layer (Zod Schemas)", () => {
  it("POST /api/auth/register rejects malformed email and short password", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "not-an-email", password: "short" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(res.body.details).toBeDefined();
    expect(Array.isArray(res.body.details)).toBe(true);
    expect(res.body.details.some((d) => d.field === "email")).toBe(true);
    expect(res.body.details.some((d) => d.field === "password")).toBe(true);
  });

  it("POST /api/auth/login rejects missing fields", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "user@example.com" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(res.body.details.some((d) => d.field === "password")).toBe(true);
  });

  it("POST /api/vehicles rejects invalid price or negative quantity", async () => {
    const headers = await createAuthHeader("admin");

    const res = await request(app)
      .post("/api/vehicles")
      .set(headers)
      .send({
        make: "Toyota",
        model: "Camry",
        category: "Sedan",
        year: 2024,
        price: -500,
        quantity: -2,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(res.body.details.some((d) => d.field === "price")).toBe(true);
    expect(res.body.details.some((d) => d.field === "quantity")).toBe(true);
  });

  it("PUT /api/vehicles/:id rejects invalid field types", async () => {
    const headers = await createAuthHeader("admin");

    const res = await request(app)
      .put("/api/vehicles/v-123")
      .set(headers)
      .send({ price: "not-a-number" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(res.body.details.some((d) => d.field === "price")).toBe(true);
  });

  it("POST /api/vehicles/:id/restock rejects zero or negative restock quantity", async () => {
    const headers = await createAuthHeader("admin");

    const res = await request(app)
      .post("/api/vehicles/v-123/restock")
      .set(headers)
      .send({ quantity: -5 });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(res.body.details.some((d) => d.field === "quantity")).toBe(true);
  });
});
