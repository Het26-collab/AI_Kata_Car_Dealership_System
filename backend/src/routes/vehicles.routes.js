import { Router } from "express";
import * as VehiclesController from "../controllers/vehicles.controller.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  createVehicleSchema,
  updateVehicleSchema,
  restockSchema,
} from "../schemas/vehicle.schema.js";

const router = Router();

router.get("/stats", requireAuth, VehiclesController.stats);
router.get("/purchases", requireAuth, VehiclesController.listPurchases);
router.get("/search", requireAuth, VehiclesController.searchVehicles);
router.get("/", requireAuth, VehiclesController.list);
router.get("/:id", requireAuth, VehiclesController.getOne);
router.post("/:id/quote", requireAuth, VehiclesController.generateQuote);
router.post("/:id/purchase", requireAuth, VehiclesController.purchaseVehicle);
router.post("/:id/restock", requireAuth, requireAdmin, validate(restockSchema), VehiclesController.restockVehicle);
router.post("/", requireAuth, requireAdmin, validate(createVehicleSchema), VehiclesController.createVehicle);
router.put("/:id", requireAuth, requireAdmin, validate(updateVehicleSchema), VehiclesController.updateVehicle);
router.patch("/:id", requireAuth, requireAdmin, validate(updateVehicleSchema), VehiclesController.updateVehicle);
router.delete("/:id", requireAuth, requireAdmin, VehiclesController.deleteVehicle);

export default router;
