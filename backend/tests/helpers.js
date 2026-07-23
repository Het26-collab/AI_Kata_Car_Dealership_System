import request from "supertest";
import bcrypt from "bcryptjs";
import { app } from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";

export function generateUniqueEmail(prefix = "user") {
  return `${prefix}-${Date.now()}-${crypto.randomUUID()}@example.com`;
}

export async function createAuthHeader(role = "admin") {
  const password = "password123";
  const passwordHash = await bcrypt.hash(password, 10);
  const email = generateUniqueEmail(role);

  await prisma.user.create({
    data: {
      email,
      passwordHash,
      role,
    },
  });

  const loginResponse = await request(app).post("/api/auth/login").send({
    email,
    password,
  });

  const token = loginResponse.body?.data?.token;
  if (!token) {
    throw new Error(
      `Failed to create auth header. status=${loginResponse.status} body=${JSON.stringify(loginResponse.body)}`,
    );
  }

  return { Authorization: `Bearer ${token}` };
}
