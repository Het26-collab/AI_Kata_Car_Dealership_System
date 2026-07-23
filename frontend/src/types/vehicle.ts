export type VehicleCategory =
  | "Sedan"
  | "SUV"
  | "Truck"
  | "Electric"
  | "Luxury"
  | "Performance";

export type VehicleStatus = "In Stock" | "Reserved" | "In Transit" | "Sold";

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  trim: string;
  year: number;
  category: VehicleCategory;
  dealerId: string;
  vin: string;
  price: number;
  quantity: number;
  status: VehicleStatus;
  image: string;
  createdAt: string;
}

export type VehicleDraft = Omit<Vehicle, "id" | "createdAt" | "image"> &
  Partial<Pick<Vehicle, "image">>;

export interface VehicleFilters {
  search?: string;
  make?: string;
  model?: string;
  category?: VehicleCategory | "All";
  status?: VehicleStatus | "All";
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "oldest" | "price-asc" | "price-desc";
}

export interface InventoryMixEntry {
  category: VehicleCategory;
  units: number;
}

export interface FleetStats {
  totalVehicles: number;
  available: number;
  lowStock: number;
  soldToday: number;
  availablePct: number;
  inventoryMix: InventoryMixEntry[];
}

export const VEHICLE_CATEGORIES: VehicleCategory[] = [
  "Sedan",
  "SUV",
  "Truck",
  "Electric",
  "Luxury",
  "Performance",
];

export const VEHICLE_STATUSES: VehicleStatus[] = [
  "In Stock",
  "Reserved",
  "In Transit",
  "Sold",
];
