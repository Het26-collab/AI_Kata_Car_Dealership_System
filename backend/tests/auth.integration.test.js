import request from "supertest";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { describe, expect, it } from "vitest";
import { app } from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { generateUniqueEmail } from "./helpers.js";

describe("auth and authorization", () => {
  it("registers a user with a hashed password and omits the password hash from the response", async () => {
    const email = generateUniqueEmail("buyer");
    const response = await request(app).post("/api/auth/register").send({
      email,
      password: "strongPass123",
    });

    expect(response.status).toBe(201);
    expect(response.body.data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        email,
        role: "user",
        createdAt: expect.any(String),
      })
    );
    expect(response.body.data.passwordHash).toBeUndefined();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    expect(user).not.toBeNull();
    expect(user.passwordHash).not.toBe("strongPass123");
  });

  it("rejects duplicate email registration", async () => {
    const email = generateUniqueEmail("dup");
    await request(app).post("/api/auth/register").send({
      email,
      password: "strongPass123",
    });

    const response = await request(app).post("/api/auth/register").send({
      email,
      password: "strongPass123",
    });

    expect(response.status).toBe(409);
    expect(response.body.error).toMatch(/already exists/i);
  });

  it("rejects invalid email and weak password on registration", async () => {
    const response = await request(app).post("/api/auth/register").send({
      email: "not-an-email",
      password: "short",
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/valid email/i),
        expect.stringMatching(/at least 8 characters/i),
      ])
    );
  });

  it("logs in with a real signed JWT containing the user id and role", async () => {
    const email = generateUniqueEmail("admin");
    const passwordHash = await bcrypt.hash("strongPass123", 10);
    const admin = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: "admin",
      },
    });

    const response = await request(app).post("/api/auth/login").send({
      email,
      password: "strongPass123",
    });

    expect(response.status).toBe(200);
    expect(response.body.data.token).toEqual(expect.any(String));
    expect(response.body.data.user).toEqual(
      expect.objectContaining({
        id: admin.id,
        email,
        role: "admin",
      })
    );

    const payload = jwt.verify(response.body.data.token, "test-jwt-secret");
    expect(payload).toMatchObject({
      sub: admin.id,
      role: "admin",
    });
  });

  it("rejects login with invalid credentials", async () => {
    const email = generateUniqueEmail("buyer");
    await request(app).post("/api/auth/register").send({
      email,
      password: "strongPass123",
    });

    const response = await request(app).post("/api/auth/login").send({
      email,
      password: "wrongPass123",
    });

    expect(response.status).toBe(401);
  });

  it("rejects protected vehicle routes when the token is missing or invalid", async () => {
    const missingTokenResponse = await request(app).get("/api/vehicles");
    expect(missingTokenResponse.status).toBe(401);

    const invalidTokenResponse = await request(app)
      .get("/api/vehicles")
      .set("Authorization", "Bearer definitely-not-valid");

    expect(invalidTokenResponse.status).toBe(401);
  });

  it("rejects non-admin users on admin-only routes", async () => {
    const email = generateUniqueEmail("buyer");
    await request(app).post("/api/auth/register").send({
      email,
      password: "strongPass123",
    });

    const loginResponse = await request(app).post("/api/auth/login").send({
      email,
      password: "strongPass123",
    });

    const vehicle = await prisma.vehicle.create({
      data: {
        make: "Toyota",
        model: "Camry",
        category: "Sedan",
        price: 29000,
        quantity: 4,
      },
    });

    const response = await request(app)
      .delete(`/api/vehicles/${vehicle.id}`)
      .set("Authorization", `Bearer ${loginResponse.body.data.token}`);

    expect(response.status).toBe(403);
  });
});
