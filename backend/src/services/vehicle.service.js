import * as vehicleRepository from "../repositories/vehicle.repository.js";

const CATEGORIES = ["Sedan", "SUV", "Truck", "Electric", "Luxury", "Performance"];

function validateVehicleInput(body, { partial = false } = {}) {
  const errors = [];
  const requiredFields = ["make", "model", "category", "price", "quantity"];

  if (!partial) {
    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null || body[field] === "") {
        errors.push(`"${field}" is required.`);
      }
    }
  }

  if (body.make !== undefined && String(body.make).trim().length === 0) {
    errors.push('"make" is required.');
  }

  if (body.model !== undefined && String(body.model).trim().length === 0) {
    errors.push('"model" is required.');
  }

  if (body.category !== undefined && !CATEGORIES.includes(body.category)) {
    errors.push(`"category" must be one of: ${CATEGORIES.join(", ")}.`);
  }

  if (body.price !== undefined && (!Number.isInteger(Number(body.price)) || Number(body.price) < 0)) {
    errors.push('"price" must be a non-negative integer.');
  }

  if (body.quantity !== undefined && (!Number.isInteger(Number(body.quantity)) || Number(body.quantity) < 0)) {
    errors.push('"quantity" must be a non-negative integer.');
  }

  return errors;
}

function normalizeVehicleInput(body, { partial = false } = {}) {
  const normalized = {};

  if (!partial || body.make !== undefined) normalized.make = String(body.make).trim();
  if (!partial || body.model !== undefined) normalized.model = String(body.model).trim();
  if (!partial || body.category !== undefined) normalized.category = String(body.category).trim();
  if (!partial || body.price !== undefined) normalized.price = Number(body.price);
  if (!partial || body.quantity !== undefined) normalized.quantity = Number(body.quantity);

  return normalized;
}

export function validateCreate(body) {
  return validateVehicleInput(body, { partial: false });
}

export function validateUpdate(body) {
  return validateVehicleInput(body, { partial: true });
}

export async function createVehicle(body) {
  return vehicleRepository.create(normalizeVehicleInput(body, { partial: false }));
}

export async function listVehicles(filters = {}) {
  const limit = filters.limit !== undefined && !isNaN(Number(filters.limit)) ? Math.max(1, Number(filters.limit)) : 20;
  const offset = filters.offset !== undefined && !isNaN(Number(filters.offset)) ? Math.max(0, Number(filters.offset)) : 0;

  const normalizedFilters = {
    search: filters.search ? String(filters.search).trim() : undefined,
    category: filters.category && filters.category !== "All" ? String(filters.category).trim() : undefined,
    minPrice: filters.minPrice !== undefined && filters.minPrice !== "" ? Number(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice !== undefined && filters.maxPrice !== "" ? Number(filters.maxPrice) : undefined,
  };

  const [vehicles, total] = await Promise.all([
    vehicleRepository.findMany(normalizedFilters, { limit, offset }),
    vehicleRepository.count(normalizedFilters),
  ]);

  return { vehicles, total, limit, offset };
}

export async function searchVehicles(filters = {}) {
  const limit = filters.limit !== undefined && !isNaN(Number(filters.limit)) ? Math.max(1, Number(filters.limit)) : 20;
  const offset = filters.offset !== undefined && !isNaN(Number(filters.offset)) ? Math.max(0, Number(filters.offset)) : 0;

  const normalizedFilters = {
    make: filters.make ? String(filters.make).trim() : undefined,
    model: filters.model ? String(filters.model).trim() : undefined,
    category: filters.category && filters.category !== "All" ? String(filters.category).trim() : undefined,
    minPrice: filters.minPrice !== undefined && filters.minPrice !== "" ? Number(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice !== undefined && filters.maxPrice !== "" ? Number(filters.maxPrice) : undefined,
  };

  const [vehicles, total] = await Promise.all([
    vehicleRepository.findMany(normalizedFilters, { limit, offset }),
    vehicleRepository.count(normalizedFilters),
  ]);

  return { vehicles, total, limit, offset };
}

export async function getVehicle(id) {
  return vehicleRepository.findById(id);
}

export async function updateVehicle(id, body) {
  return vehicleRepository.update(id, normalizeVehicleInput(body, { partial: true }));
}

export async function deleteVehicle(id) {
  return vehicleRepository.remove(id);
}

export async function purchaseVehicle(id) {
  const vehicle = await vehicleRepository.findById(id);
  if (!vehicle) {
    return { status: 404, error: "Vehicle not found." };
  }

  if (vehicle.quantity <= 0) {
    return { status: 409, error: "Vehicle is out of stock." };
  }

  const updatedVehicle = await vehicleRepository.update(id, { quantity: vehicle.quantity - 1 });
  return { status: 200, data: updatedVehicle };
}

export async function restockVehicle(id, body = {}) {
  const vehicle = await vehicleRepository.findById(id);
  if (!vehicle) {
    return { status: 404, error: "Vehicle not found." };
  }

  const amount = body.quantity !== undefined && body.quantity !== null ? Number(body.quantity) : 1;
  const increment = Number.isInteger(amount) && amount > 0 ? amount : 1;

  const updatedVehicle = await vehicleRepository.update(id, { quantity: vehicle.quantity + increment });
  return { status: 200, data: updatedVehicle };
}

export async function getStats() {
  const vehicles = await vehicleRepository.findMany({});
  const totalVehicles = vehicles.reduce((sum, vehicle) => sum + vehicle.quantity, 0);
  const lowStock = vehicles.filter((vehicle) => vehicle.quantity <= 1).length;

  const inventoryMix = CATEGORIES.map((category) => ({
    category,
    units: vehicles
      .filter((vehicle) => vehicle.category === category)
      .reduce((sum, vehicle) => sum + vehicle.quantity, 0),
  })).filter((entry) => entry.units > 0);

  return {
    totalVehicles,
    available: totalVehicles,
    lowStock,
    soldToday: 0,
    availablePct: totalVehicles > 0 ? 100 : 0,
    inventoryMix,
  };
}
