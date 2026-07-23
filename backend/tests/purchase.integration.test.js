import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { createAuthHeader } from "./helpers.js";

describe("POST /api/vehicles/:id/purchase", () => {
  it("requires authentication (returns 401 without valid token)", async () => {
    const response = await request(app).post(
      "/api/vehicles/non-existent-id/purchase",
    );

    expect(response.status).toBe(401);
  });

  it("returns 404 when the vehicle id does not exist", async () => {
    const headers = await createAuthHeader("user");

    const response = await request(app)
      .post("/api/vehicles/non-existent-id/purchase")
      .set(headers);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Vehicle not found.");
  });

  it("decrements quantity by 1 on happy path", async () => {
    const headers = await createAuthHeader("user");

    const vehicle = await prisma.vehicle.create({
      data: {
        make: "Honda",
        model: "Accord",
        category: "Sedan",
        price: 28000,
        quantity: 3,
      },
    });

    const response = await request(app)
      .post(`/api/vehicles/${vehicle.id}/purchase`)
      .set(headers);

    expect(response.status).toBe(200);
    expect(response.body.data.quantity).toBe(2);

    const updatedVehicle = await prisma.vehicle.findUnique({
      where: { id: vehicle.id },
    });
    expect(updatedVehicle.quantity).toBe(2);
  });

  it("rejects with 409 or 400 when quantity is already 0", async () => {
    const headers = await createAuthHeader("user");

    const vehicle = await prisma.vehicle.create({
      data: {
        make: "Mazda",
        model: "CX-5",
        category: "SUV",
        price: 30000,
        quantity: 0,
      },
    });

    const response = await request(app)
      .post(`/api/vehicles/${vehicle.id}/purchase`)
      .set(headers);

    expect([400, 409]).toContain(response.status);
    expect(response.body.error).toBeDefined();

    const unchangedVehicle = await prisma.vehicle.findUnique({
      where: { id: vehicle.id },
    });
    expect(unchangedVehicle.quantity).toBe(0);
  });
});
