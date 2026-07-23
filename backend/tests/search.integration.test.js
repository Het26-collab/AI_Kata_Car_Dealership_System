import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { createAuthHeader } from "./helpers.js";

describe("GET /api/vehicles/search", () => {
  async function seedVehicles() {
    await prisma.vehicle.createMany({
      data: [
        {
          make: "Toyota",
          model: "Camry",
          category: "Sedan",
          price: 25000,
          quantity: 5,
        },
        {
          make: "Toyota",
          model: "RAV4",
          category: "SUV",
          price: 32000,
          quantity: 3,
        },
        {
          make: "Honda",
          model: "Civic",
          category: "Sedan",
          price: 22000,
          quantity: 4,
        },
        {
          make: "Ford",
          model: "F-150",
          category: "Truck",
          price: 45000,
          quantity: 2,
        },
      ],
    });
  }

  it("filters by make only", async () => {
    const headers = await createAuthHeader("user");
    await seedVehicles();

    const response = await request(app)
      .get("/api/vehicles/search")
      .set(headers)
      .query({ make: "Toyota" });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ make: "Toyota", model: "Camry" }),
        expect.objectContaining({ make: "Toyota", model: "RAV4" }),
      ]),
    );
  });

  it("filters by category only", async () => {
    const headers = await createAuthHeader("user");
    await seedVehicles();

    const response = await request(app)
      .get("/api/vehicles/search")
      .set(headers)
      .query({ category: "SUV" });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0]).toMatchObject({
      make: "Toyota",
      model: "RAV4",
      category: "SUV",
    });
  });

  it("filters by price range only (minPrice and maxPrice)", async () => {
    const headers = await createAuthHeader("user");
    await seedVehicles();

    const response = await request(app)
      .get("/api/vehicles/search")
      .set(headers)
      .query({ minPrice: 24000, maxPrice: 35000 });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          make: "Toyota",
          model: "Camry",
          price: 25000,
        }),
        expect.objectContaining({
          make: "Toyota",
          model: "RAV4",
          price: 32000,
        }),
      ]),
    );
  });

  it("filters by combined make, model, category, and price range", async () => {
    const headers = await createAuthHeader("user");
    await seedVehicles();

    const response = await request(app)
      .get("/api/vehicles/search")
      .set(headers)
      .query({
        make: "Honda",
        model: "Civic",
        category: "Sedan",
        minPrice: 20000,
        maxPrice: 25000,
      });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0]).toMatchObject({
      make: "Honda",
      model: "Civic",
      category: "Sedan",
      price: 22000,
    });
  });

  it("returns an empty array when no vehicles match the criteria", async () => {
    const headers = await createAuthHeader("user");
    await seedVehicles();

    const response = await request(app)
      .get("/api/vehicles/search")
      .set(headers)
      .query({ make: "NonExistentMake" });

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual([]);
    expect(response.body.total).toBe(0);
  });
});
