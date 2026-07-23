import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { createAuthHeader } from "./helpers.js";

describe("Pagination Support (limit & offset)", () => {
  it("GET /api/vehicles returns default limit=20 and offset=0 with total count", async () => {
    const headers = await createAuthHeader("admin");

    const res = await request(app).get("/api/vehicles").set(headers);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("total");
    expect(res.body.limit).toBe(20);
    expect(res.body.offset).toBe(0);
  });

  it("GET /api/vehicles accepts custom limit and offset query parameters", async () => {
    const headers = await createAuthHeader("admin");

    await prisma.vehicle.createMany({
      data: [
        { make: "Audi", model: "A4", category: "Sedan", price: 40000, quantity: 5 },
        { make: "Audi", model: "A6", category: "Sedan", price: 55000, quantity: 3 },
        { make: "Audi", model: "Q7", category: "SUV", price: 65000, quantity: 2 },
      ],
    });

    const res = await request(app)
      .get("/api/vehicles")
      .set(headers)
      .query({ limit: 2, offset: 1 });

    expect(res.status).toBe(200);
    expect(res.body.total).toBe(3);
    expect(res.body.limit).toBe(2);
    expect(res.body.offset).toBe(1);
    expect(res.body.data.length).toBe(2);
  });

  it("GET /api/vehicles/search returns limit and offset in response shape", async () => {
    const headers = await createAuthHeader("admin");

    await prisma.vehicle.create({
      data: { make: "BMW", model: "M3", category: "Performance", price: 75000, quantity: 1 },
    });

    const res = await request(app)
      .get("/api/vehicles/search")
      .set(headers)
      .query({ make: "BMW", limit: 10, offset: 0 });

    expect(res.status).toBe(200);
    expect(res.body.total).toBe(1);
    expect(res.body.limit).toBe(10);
    expect(res.body.offset).toBe(0);
  });
});
