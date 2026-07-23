import { z } from "zod";

export const createVehicleSchema = z.object({
  make: z.string({ required_error: "Make is required" }).min(1, "Make cannot be empty"),
  model: z.string({ required_error: "Model is required" }).min(1, "Model cannot be empty"),
  category: z.string({ required_error: "Category is required" }).min(1, "Category cannot be empty"),
  year: z.coerce.number().int().min(1900).max(2100).optional(),
  price: z.coerce.number({ required_error: "Price is required" }).nonnegative("Price must be greater than or equal to 0"),
  quantity: z.coerce.number({ required_error: "Quantity is required" }).int().nonnegative("Quantity must be greater than or equal to 0"),
  trim: z.string().optional(),
  vin: z.string().optional(),
  dealerId: z.string().optional(),
  status: z.string().optional(),
  image: z.string().optional(),
  imageUrl: z.string().optional(),
  mileage: z.coerce.number().int().nonnegative().optional(),
  color: z.string().optional(),
  fuelType: z.string().optional(),
  transmission: z.string().optional(),
  description: z.string().optional(),
});

export const updateVehicleSchema = createVehicleSchema.partial();

export const restockSchema = z.object({
  quantity: z.coerce.number().int().positive("Restock quantity must be positive").optional().default(1),
});
