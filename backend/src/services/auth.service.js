import "dotenv/config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";
import * as userRepository from "../repositories/user.repository.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const JWT_SECRET = process.env.JWT_SECRET ?? "dev-jwt-secret";

function sanitizeUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name || "Fleet Manager",
    role: user.role,
    dealership: user.dealership || "Global Motors",
    avatar: user.avatar || "",
    createdAt: user.createdAt,
  };
}

export function validateRegistration(body) {
  const errors = [];

  if (!body.email || !EMAIL_REGEX.test(String(body.email))) {
    errors.push('"email" must be a valid email address.');
  }

  if (!body.password || String(body.password).length < 8) {
    errors.push('"password" must be at least 8 characters.');
  }

  return errors;
}

export function validateLogin(body) {
  const errors = [];

  if (!body.email || !EMAIL_REGEX.test(String(body.email))) {
    errors.push('"email" must be a valid email address.');
  }

  if (!body.password) {
    errors.push('"password" is required.');
  }

  return errors;
}

export async function registerUser(body) {
  const email = String(body.email).trim().toLowerCase();
  const passwordHash = await bcrypt.hash(String(body.password), 10);

  try {
    const user = await userRepository.create({
      email,
      passwordHash,
      role: "user",
    });

    return sanitizeUser(user);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const duplicateError = new Error("A user with that email already exists.");
      duplicateError.status = 409;
      throw duplicateError;
    }

    throw error;
  }
}

export async function loginUser(body) {
  const email = String(body.email).trim().toLowerCase();
  const user = await userRepository.findByEmail(email);

  if (!user) {
    const error = new Error("Invalid email or password.");
    error.status = 401;
    throw error;
  }

  const passwordMatches = await bcrypt.compare(String(body.password), user.passwordHash);

  if (!passwordMatches) {
    const error = new Error("Invalid email or password.");
    error.status = 401;
    throw error;
  }

  const token = jwt.sign({ role: user.role }, JWT_SECRET, {
    subject: user.id,
    expiresIn: "1h",
  });

  return {
    token,
    user: sanitizeUser(user),
  };
}

export async function getCurrentUser(userId) {
  const user = await userRepository.findById(userId);
  return user ? sanitizeUser(user) : null;
}
