import { prisma } from "../lib/prisma.js";

export async function create(data) {
  return prisma.user.create({ data });
}

export async function findByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

export async function findById(id) {
  return prisma.user.findUnique({ where: { id } });
}
