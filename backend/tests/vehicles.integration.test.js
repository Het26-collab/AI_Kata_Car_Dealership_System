import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { createAuthHeader } from "./helpers.js";

describe("vehicle API with real database", () => {
  it("creates a vehicle in SQLite and returns only the required fields", async () => {
    const headers = await createAuthHeader("admin");

    const response = await request(app)
      .post("/api/vehicles")
      .set(headers)
      .send({
        make: "Toyota",
        model: "Camry",
        category: "Sedan",
        price: 29000,
        quantity: 4,
      });

    expect(response.status).toBe(201);
    expect(response.body.data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        make: "Toyota",
        model: "Camry",
        category: "Sedan",
        price: 29000,
        quantity: 4,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }),
    );

    const savedVehicle = await prisma.vehicle.findUnique({
      where: { id: response.body.data.id },
    });

    expect(savedVehicle).not.toBeNull();
    expect(savedVehicle).toMatchObject({
      make: "Toyota",
      model: "Camry",
      category: "Sedan",
      price: 29000,
      quantity: 4,
    });
  });

  it("lists vehicles from SQLite", async () => {
    const headers = await createAuthHeader("admin");

    await prisma.vehicle.createMany({
      data: [
        {
          make: "Honda",
          model: "Civic",
          category: "Sedan",
          price: 25000,
          quantity: 3,
        },
        {
          make: "Ford",
          model: "Explorer",
          category: "SUV",
          price: 41000,
          quantity: 2,
        },
      ],
    });

    const response = await request(app).get("/api/vehicles").set(headers);

    expect(response.status).toBe(200);
    expect(response.body.total).toBe(2);
    expect(response.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ make: "Honda", model: "Civic" }),
        expect.objectContaining({ make: "Ford", model: "Explorer" }),
      ]),
    );
  });

  it("updates an existing vehicle in SQLite", async () => {
    const headers = await createAuthHeader("admin");

    const vehicle = await prisma.vehicle.create({
      data: {
        make: "Tesla",
        model: "Model 3",
        category: "Electric",
        price: 39999,
        quantity: 5,
      },
    });

    const response = await request(app)
      .put(`/api/vehicles/${vehicle.id}`)
      .set(headers)
      .send({
        price: 38999,
        quantity: 6,
      });

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual(
      expect.objectContaining({
        id: vehicle.id,
        price: 38999,
        quantity: 6,
      }),
    );

    const updatedVehicle = await prisma.vehicle.findUnique({
      where: { id: vehicle.id },
    });

    expect(updatedVehicle).toMatchObject({
      price: 38999,
      quantity: 6,
    });
  });

  it("deletes a vehicle from SQLite", async () => {
    const headers = await createAuthHeader("admin");

    const vehicle = await prisma.vehicle.create({
      data: {
        make: "BMW",
        model: "X5",
        category: "SUV",
        price: 65000,
        quantity: 1,
      },
    });

    const response = await request(app)
      .delete(`/api/vehicles/${vehicle.id}`)
      .set(headers);

    expect(response.status).toBe(204);

    const deletedVehicle = await prisma.vehicle.findUnique({
      where: { id: vehicle.id },
    });

    expect(deletedVehicle).toBeNull();
  });

  it("searches vehicles in SQLite by make, model, category, and price range via list query params", async () => {
    const headers = await createAuthHeader("admin");

    await prisma.vehicle.createMany({
      data: [
        {
          make: "Toyota",
          model: "Corolla",
          category: "Sedan",
          price: 22000,
          quantity: 8,
        },
        {
          make: "Toyota",
          model: "RAV4",
          category: "SUV",
          price: 33000,
          quantity: 2,
        },
        {
          make: "Ford",
          model: "Mustang",
          category: "Performance",
          price: 56000,
          quantity: 1,
        },
      ],
    });

    const response = await request(app)
      .get("/api/vehicles")
      .set(headers)
      .query({
        search: "toyota",
        category: "SUV",
        minPrice: 30000,
        maxPrice: 35000,
      });

    expect(response.status).toBe(200);
    expect(response.body.total).toBe(1);
    expect(response.body.data).toEqual([
      expect.objectContaining({
        make: "Toyota",
        model: "RAV4",
        category: "SUV",
        price: 33000,
      }),
    ]);
  });
});
