import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import { InventoryPage } from "./InventoryPage";
import type { Vehicle } from "../types/vehicle";

let currentRole: "admin" | "user" = "user";

vi.mock("../layouts/DashboardLayout", () => ({
  DashboardLayout: ({ children, onAddVehicle }: { children: ReactNode; onAddVehicle?: () => void }) => (
    <div>
      {onAddVehicle && <button type="button">Sidebar Add Vehicle</button>}
      {children}
    </div>
  ),
}));

vi.mock("../hooks/useDebounce", () => ({
  useDebounce: (value: string) => value,
}));

vi.mock("../hooks/useToast", () => ({
  useToast: () => ({ showToast: vi.fn() }),
}));

vi.mock("../hooks/useAuth", () => ({
  useAuth: () => ({ user: { role: currentRole } }),
}));

vi.mock("../components/VehicleFormModal", () => ({
  VehicleFormModal: () => null,
}));

vi.mock("../components/ConfirmDialog", () => ({
  ConfirmDialog: () => null,
}));

function vehicleFixture(): Vehicle {
  return {
    id: "v-1",
    make: "Toyota",
    model: "Camry",
    trim: "SE",
    year: 2024,
    category: "Sedan",
    dealerId: "DLR-100",
    vin: "VIN12345",
    price: 32000,
    quantity: 2,
    status: "In Stock",
    image: "https://example.com/car.jpg",
    mileage: 0,
    color: "White",
    fuelType: "Gasoline",
    transmission: "Automatic",
    description: "Test",
    createdAt: new Date().toISOString(),
  };
}

vi.mock("../hooks/useVehicles", () => ({
  useVehicles: () => ({
    vehicles: [vehicleFixture()],
    total: 1,
    isLoading: false,
    error: null,
    refetch: vi.fn(),
    createVehicle: vi.fn(),
    updateVehicle: vi.fn(),
    deleteVehicle: vi.fn(),
    purchaseVehicle: vi.fn(),
    restockVehicle: vi.fn(),
  }),
}));

describe("InventoryPage admin-only control gating", () => {
  beforeEach(() => {
    currentRole = "user";
  });

  it("hides add/edit/delete/restock controls for non-admin users", () => {
    currentRole = "user";
    render(<InventoryPage />);

    expect(screen.queryByRole("button", { name: /sidebar add vehicle/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /restock/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /edit/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /delete/i })).not.toBeInTheDocument();
  });

  it("shows add/edit/delete/restock controls for admin users", () => {
    currentRole = "admin";
    render(<InventoryPage />);

    expect(screen.getByRole("button", { name: /sidebar add vehicle/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /restock/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });
});
