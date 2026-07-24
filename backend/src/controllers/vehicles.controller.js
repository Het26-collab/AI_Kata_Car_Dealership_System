import { Prisma } from "@prisma/client";
import * as vehicleService from "../services/vehicle.service.js";

export async function list(req, res, next) {
  try {
    const { vehicles, total, limit, offset } = await vehicleService.listVehicles(req.query);
    res.json({ data: vehicles, total, limit, offset });
  } catch (error) {
    next(error);
  }
}

export async function searchVehicles(req, res, next) {
  try {
    const { vehicles, total, limit, offset } = await vehicleService.searchVehicles(req.query);
    res.json({ data: vehicles, total, limit, offset });
  } catch (error) {
    next(error);
  }
}

export async function getOne(req, res, next) {
  try {
    const vehicle = await vehicleService.getVehicle(req.params.id);
    if (!vehicle) return res.status(404).json({ error: "Vehicle not found." });
    res.json({ data: vehicle });
  } catch (error) {
    next(error);
  }
}

export async function createVehicle(req, res, next) {
  try {
    const errors = vehicleService.validateCreate(req.body);
    if (errors.length) return res.status(400).json({ errors });

    const vehicle = await vehicleService.createVehicle(req.body);
    res.status(201).json({ data: vehicle });
  } catch (error) {
    next(error);
  }
}

export async function updateVehicle(req, res, next) {
  try {
    const errors = vehicleService.validateUpdate(req.body);
    if (errors.length) return res.status(400).json({ errors });

    const vehicle = await vehicleService.updateVehicle(req.params.id, req.body);
    res.json({ data: vehicle });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return res.status(404).json({ error: "Vehicle not found." });
    }
    next(error);
  }
}

export async function deleteVehicle(req, res, next) {
  try {
    await vehicleService.deleteVehicle(req.params.id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return res.status(404).json({ error: "Vehicle not found." });
    }
    next(error);
  }
}

export async function purchaseVehicle(req, res, next) {
  try {
    const result = await vehicleService.purchaseVehicle(req.params.id);
    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }
    res.json({ data: result.data });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return res.status(404).json({ error: "Vehicle not found." });
    }
    next(error);
  }
}

export async function restockVehicle(req, res, next) {
  try {
    const result = await vehicleService.restockVehicle(req.params.id, req.body);
    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }
    res.json({ data: result.data });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return res.status(404).json({ error: "Vehicle not found." });
    }
    next(error);
  }
}

export async function stats(req, res, next) {
  try {
    const stats = await vehicleService.getStats();
    res.json({ data: stats });
  } catch (error) {
    next(error);
  }
}

export async function generateQuote(req, res, next) {
  try {
    const vehicle = await vehicleService.getVehicle(req.params.id);
    if (!vehicle) return res.status(404).json({ error: "Vehicle not found." });

    const { generatePdfQuote } = await import("../services/pdfQuote.service.js");
    const pdfBuffer = await generatePdfQuote(vehicle, req.body || {});

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="quote-${vehicle.make}-${vehicle.model}.pdf"`
    );
    res.status(200).send(pdfBuffer);
  } catch (error) {
    next(error);
  }
}
