import * as vehicleRepository from "../repositories/vehicle.repository.js";

const CATEGORIES = ["Sedan", "SUV", "Truck", "Electric", "Luxury", "Performance"];

const FUEL_TYPES = ["Gasoline", "Diesel", "Hybrid", "Electric", "Plug-in Hybrid"];
const TRANSMISSIONS = ["Automatic", "Manual", "CVT", "Dual-Clutch", "Single-Speed Direct Drive"];
const STATUSES = ["In Stock", "Reserved", "In Transit", "Sold"];

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

  if (body.year !== undefined) {
    const year = Number(body.year);
    if (!Number.isInteger(year) || year < 1900 || year > 2100) {
      errors.push('"year" must be an integer between 1900 and 2100.');
    }
  }

  if (body.mileage !== undefined) {
    const mileage = Number(body.mileage);
    if (!Number.isInteger(mileage) || mileage < 0) {
      errors.push('"mileage" must be a non-negative integer.');
    }
  }

  if (body.fuelType !== undefined && !FUEL_TYPES.includes(body.fuelType)) {
    errors.push(`"fuelType" must be one of: ${FUEL_TYPES.join(", ")}.`);
  }

  if (body.status !== undefined && !STATUSES.includes(body.status)) {
    errors.push(`"status" must be one of: ${STATUSES.join(", ")}.`);
  }

  return errors;
}

function normalizeVehicleInput(body, { partial = false } = {}) {
  const normalized = {};

  // Required fields
  if (!partial || body.make !== undefined) normalized.make = String(body.make).trim();
  if (!partial || body.model !== undefined) normalized.model = String(body.model).trim();
  if (!partial || body.category !== undefined) normalized.category = String(body.category).trim();
  if (!partial || body.price !== undefined) normalized.price = Number(body.price);
  if (!partial || body.quantity !== undefined) normalized.quantity = Number(body.quantity);

  // Optional extended fields
  if (body.trim !== undefined) normalized.trim = String(body.trim).trim();
  if (body.year !== undefined) normalized.year = Number(body.year);
  if (body.vin !== undefined) normalized.vin = String(body.vin).trim().toUpperCase();
  if (body.dealerId !== undefined) normalized.dealerId = String(body.dealerId).trim();
  if (body.status !== undefined) normalized.status = String(body.status).trim();
  if (body.image !== undefined) normalized.image = String(body.image).trim();
  if (body.mileage !== undefined) normalized.mileage = Number(body.mileage);
  if (body.color !== undefined) normalized.color = String(body.color).trim();
  if (body.fuelType !== undefined) normalized.fuelType = String(body.fuelType).trim();
  if (body.transmission !== undefined) normalized.transmission = String(body.transmission).trim();
  if (body.description !== undefined) normalized.description = String(body.description).trim();

  return normalized;
}

/**
 * Enriches a database vehicle record with any frontend-required fields
 * that may not exist in the DB row. This acts as a safety net so
 * the frontend never encounters undefined on critical display fields.
 */
export function enrichVehicle(vehicle) {
  if (!vehicle) return vehicle;

  const enriched = { ...vehicle };

  // Derive status from quantity if not stored
  if (!enriched.status) {
    enriched.status = enriched.quantity <= 0 ? "Sold" : "In Stock";
  }

  // Fallback VIN
  if (!enriched.vin) {
    const cleanId = (enriched.id || "").replace(/[^a-zA-Z0-9]/g, "");
    enriched.vin = `1FTFW1RG5LF${(cleanId + "1234567890").slice(0, 6).toUpperCase()}`;
  }

  // Fallback image
  if (!enriched.image) {
    const images = {
      Sedan:       "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80",
      SUV:         "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80",
      Truck:       "https://images.unsplash.com/photo-1590739225287-bd31519780c3?auto=format&fit=crop&w=800&q=80",
      Electric:    "https://images.unsplash.com/photo-1619317190536-29e225ab90e7?auto=format&fit=crop&w=800&q=80",
      Luxury:      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80",
      Performance: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=800&q=80",
    };
    enriched.image = images[enriched.category] || images.Sedan;
  }

  // Fallback for other display fields
  if (!enriched.trim) enriched.trim = "Base";
  if (!enriched.year) enriched.year = new Date().getFullYear();
  if (!enriched.dealerId) enriched.dealerId = "GM-001";
  if (enriched.mileage === undefined || enriched.mileage === null) enriched.mileage = 0;
  if (!enriched.color) enriched.color = "";
  if (!enriched.fuelType) enriched.fuelType = "Gasoline";
  if (!enriched.transmission) enriched.transmission = "Automatic";
  if (!enriched.description) enriched.description = "";

  return enriched;
}

export function validateCreate(body) {
  return validateVehicleInput(body, { partial: false });
}

export function validateUpdate(body) {
  return validateVehicleInput(body, { partial: true });
}

export async function createVehicle(body) {
  const created = await vehicleRepository.create(normalizeVehicleInput(body, { partial: false }));
  return enrichVehicle(created);
}

export async function listVehicles(filters = {}) {
  const limit = filters.limit !== undefined && !isNaN(Number(filters.limit)) ? Math.max(1, Number(filters.limit)) : 20;
  const offset = filters.offset !== undefined && !isNaN(Number(filters.offset)) ? Math.max(0, Number(filters.offset)) : 0;

  const normalizedFilters = {
    search: filters.search ? String(filters.search).trim() : undefined,
    category: filters.category && filters.category !== "All" ? String(filters.category).trim() : undefined,
    status: filters.status && filters.status !== "All" ? String(filters.status).trim() : undefined,
    minPrice: filters.minPrice !== undefined && filters.minPrice !== "" ? Number(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice !== undefined && filters.maxPrice !== "" ? Number(filters.maxPrice) : undefined,
  };

  const [vehicles, total] = await Promise.all([
    vehicleRepository.findMany(normalizedFilters, { limit, offset }),
    vehicleRepository.count(normalizedFilters),
  ]);

  return { vehicles: vehicles.map(enrichVehicle), total, limit, offset };
}

export async function searchVehicles(filters = {}) {
  const limit = filters.limit !== undefined && !isNaN(Number(filters.limit)) ? Math.max(1, Number(filters.limit)) : 20;
  const offset = filters.offset !== undefined && !isNaN(Number(filters.offset)) ? Math.max(0, Number(filters.offset)) : 0;

  const normalizedFilters = {
    make: filters.make ? String(filters.make).trim() : undefined,
    model: filters.model ? String(filters.model).trim() : undefined,
    category: filters.category && filters.category !== "All" ? String(filters.category).trim() : undefined,
    status: filters.status && filters.status !== "All" ? String(filters.status).trim() : undefined,
    minPrice: filters.minPrice !== undefined && filters.minPrice !== "" ? Number(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice !== undefined && filters.maxPrice !== "" ? Number(filters.maxPrice) : undefined,
  };

  const [vehicles, total] = await Promise.all([
    vehicleRepository.findMany(normalizedFilters, { limit, offset }),
    vehicleRepository.count(normalizedFilters),
  ]);

  return { vehicles: vehicles.map(enrichVehicle), total, limit, offset };
}

export async function getVehicle(id) {
  const vehicle = await vehicleRepository.findById(id);
  return enrichVehicle(vehicle);
}

export async function updateVehicle(id, body) {
  const updated = await vehicleRepository.update(id, normalizeVehicleInput(body, { partial: true }));
  return enrichVehicle(updated);
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
  return { status: 200, data: enrichVehicle(updatedVehicle) };
}

export async function restockVehicle(id, body = {}) {
  const vehicle = await vehicleRepository.findById(id);
  if (!vehicle) {
    return { status: 404, error: "Vehicle not found." };
  }

  const amount = body.quantity !== undefined && body.quantity !== null ? Number(body.quantity) : 1;
  const increment = Number.isInteger(amount) && amount > 0 ? amount : 1;

  const updatedVehicle = await vehicleRepository.update(id, { quantity: vehicle.quantity + increment });
  return { status: 200, data: enrichVehicle(updatedVehicle) };
}

export async function getStats() {
  const vehicles = await vehicleRepository.findMany({});
  const enrichedVehicles = vehicles.map(enrichVehicle);

  const totalUnits = enrichedVehicles.reduce((sum, v) => sum + v.quantity, 0);
  const available = enrichedVehicles.filter((v) => v.status === "In Stock").reduce((sum, v) => sum + v.quantity, 0);
  const reserved = enrichedVehicles.filter((v) => v.status === "Reserved").reduce((sum, v) => sum + v.quantity, 0);
  const inTransit = enrichedVehicles.filter((v) => v.status === "In Transit").reduce((sum, v) => sum + v.quantity, 0);
  const sold = enrichedVehicles.filter((v) => v.status === "Sold").reduce((sum, v) => sum + v.quantity, 0);
  const lowStock = enrichedVehicles.filter((v) => v.quantity > 0 && v.quantity <= 2).length;

  const inventoryMix = CATEGORIES.map((category) => ({
    category,
    units: enrichedVehicles
      .filter((v) => v.category === category)
      .reduce((sum, v) => sum + v.quantity, 0),
  })).filter((entry) => entry.units > 0);

  const totalValue = enrichedVehicles.reduce((sum, v) => sum + v.price * v.quantity, 0);

  return {
    totalVehicles: totalUnits,
    totalModels: enrichedVehicles.length,
    available,
    reserved,
    inTransit,
    sold,
    lowStock,
    soldToday: 0,
    availablePct: totalUnits > 0 ? Math.round((available / totalUnits) * 100) : 0,
    inventoryMix,
    totalValue,
  };
}
