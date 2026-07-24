import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { createAuthHeader } from "./helpers.js";

describe("POST /api/vehicles/:id/quote (PDF Quote Generation)", () => {
  it("returns 401 Unauthorized when request is unauthenticated", async () => {
    const res = await request(app).post("/api/vehicles/non-existent-id/quote").send({
      downPayment: 5000,
      termMonths: 60,
      creditTier: "prime",
    });

    expect(res.status).toBe(401);
  });

  it("returns 404 Not Found when vehicle id does not exist", async () => {
    const headers = await createAuthHeader("user");

    const res = await request(app)
      .post("/api/vehicles/non-existent-id-12345/quote")
      .set(headers)
      .send({
        downPayment: 5000,
        termMonths: 60,
        creditTier: "prime",
      });

    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/vehicle not found/i);
  });

  it("returns 200 with application/pdf header and non-empty PDF binary payload on success", async () => {
    const headers = await createAuthHeader("user");

    const vehicle = await prisma.vehicle.create({
      data: {
        make: "Porsche",
        model: "911 Carrera S",
        year: 2025,
        trim: "Coupe",
        category: "Performance",
        price: 135000,
        quantity: 3,
        status: "In Stock",
        vin: "WP0AA2A99SS123456",
      },
    });

    const res = await request(app)
      .post(`/api/vehicles/${vehicle.id}/quote`)
      .set(headers)
      .send({
        downPayment: 25000,
        termMonths: 60,
        creditTier: "prime",
        tradeInValue: 10000,
      });

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/application\/pdf/);
    expect(res.headers["content-disposition"]).toMatch(/attachment/);
    expect(res.body).toBeInstanceOf(Buffer);
    expect(res.body.length).toBeGreaterThan(100);
  });
});
