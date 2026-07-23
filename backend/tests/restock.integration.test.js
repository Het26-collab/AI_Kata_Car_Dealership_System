import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { createAuthHeader } from "./helpers.js";

describe("POST /api/vehicles/:id/restock", () => {
  it("requires authentication (returns 401 without valid token)", async () => {
    const response = await request(app)
      .post("/api/vehicles/non-existent-id/restock")
      .send({ quantity: 5 });

    expect(response.status).toBe(401);
  });

  it("requires admin role (returns 403 for non-admin user)", async () => {
    const userHeaders = await createAuthHeader("user");

    const vehicle = await prisma.vehicle.create({
      data: {
        make: "Subaru",
        model: "Outback",
        category: "SUV",
        price: 31000,
        quantity: 2,
      },
    });

    const response = await request(app)
      .post(`/api/vehicles/${vehicle.id}/restock`)
      .set(userHeaders)
      .send({ quantity: 3 });

    expect(response.status).toBe(403);
    expect(response.body.error).toBe("Admin access is required.");
  });

  it("returns 404 for a non-existent vehicle ID", async () => {
    const adminHeaders = await createAuthHeader("admin");

    const response = await request(app)
      .post("/api/vehicles/non-existent-id/restock")
      .set(adminHeaders)
      .send({ quantity: 2 });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Vehicle not found.");
  });

  it("increments quantity on happy path with custom quantity and default quantity", async () => {
    const adminHeaders = await createAuthHeader("admin");

    const vehicle = await prisma.vehicle.create({
      data: {
        make: "Ford",
        model: "Bronco",
        category: "SUV",
        price: 38000,
        quantity: 1,
      },
    });

    // Custom quantity restock
    const response1 = await request(app)
      .post(`/api/vehicles/${vehicle.id}/restock`)
      .set(adminHeaders)
      .send({ quantity: 5 });

    expect(response1.status).toBe(200);
    expect(response1.body.data.quantity).toBe(6);

    // Default quantity restock (default 1)
    const response2 = await request(app)
      .post(`/api/vehicles/${vehicle.id}/restock`)
      .set(adminHeaders)
      .send({});

    expect(response2.status).toBe(200);
    expect(response2.body.data.quantity).toBe(7);

    const updatedVehicle = await prisma.vehicle.findUnique({
      where: { id: vehicle.id },
    });
    expect(updatedVehicle.quantity).toBe(7);
  });
});
