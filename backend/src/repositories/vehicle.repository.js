import { prisma } from "../lib/prisma.js";

function buildWhere(filters = {}) {
  const where = {};

  if (filters.category) {
    where.category = filters.category;
  }

  if (filters.make) {
    where.make = { contains: filters.make };
  }

  if (filters.model) {
    where.model = { contains: filters.model };
  }

  if (filters.search) {
    where.OR = [
      { make: { contains: filters.search } },
      { model: { contains: filters.search } },
    ];
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {};

    if (filters.minPrice !== undefined) {
      where.price.gte = filters.minPrice;
    }

    if (filters.maxPrice !== undefined) {
      where.price.lte = filters.maxPrice;
    }
  }

  return where;
}

export async function create(data) {
  return prisma.vehicle.create({ data });
}

export async function findMany(filters = {}, pagination = {}) {
  const where = buildWhere(filters);
  const take = pagination.limit !== undefined ? Number(pagination.limit) : undefined;
  const skip = pagination.offset !== undefined ? Number(pagination.offset) : undefined;

  return prisma.vehicle.findMany({
    where,
    take,
    skip,
    orderBy: { createdAt: "desc" },
  });
}

export async function count(filters = {}) {
  const where = buildWhere(filters);
  return prisma.vehicle.count({ where });
}

export async function findById(id) {
  return prisma.vehicle.findUnique({ where: { id } });
}

export async function update(id, data) {
  return prisma.vehicle.update({
    where: { id },
    data,
  });
}

export async function remove(id) {
  return prisma.vehicle.delete({
    where: { id },
  });
}
