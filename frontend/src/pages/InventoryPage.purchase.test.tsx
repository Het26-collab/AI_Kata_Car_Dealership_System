import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, beforeEach, vi } from "vitest";
import type { ReactNode } from "react";
import { InventoryPage } from "./InventoryPage";
import { ApiError } from "../api/client";
import type { Vehicle } from "../types/vehicle";

const showToastMock = vi.fn();
const refetchMock = vi.fn();
const createVehicleMock = vi.fn();
const updateVehicleMock = vi.fn();
const deleteVehicleMock = vi.fn();
let purchaseImpl: (id: string) => Promise<Vehicle>;
let vehiclesState: Vehicle[] = [];

vi.mock("../layouts/DashboardLayout", () => ({
  DashboardLayout: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock("../components/VehicleFormModal", () => ({
  VehicleFormModal: () => null,
}));

vi.mock("../components/ConfirmDialog", () => ({
  ConfirmDialog: () => null,
}));

vi.mock("../hooks/useDebounce", () => ({
  useDebounce: (value: string) => value,
}));

vi.mock("../hooks/useToast", () => ({
  useToast: () => ({ showToast: showToastMock }),
}));

vi.mock("../hooks/useAuth", () => ({
  useAuth: () => ({ user: { role: "admin" } }),
}));

vi.mock("../hooks/useVehicles", () => ({
  useVehicles: () => ({
    vehicles: vehiclesState,
    total: vehiclesState.length,
    isLoading: false,
    error: null,
    refetch: refetchMock,
    createVehicle: createVehicleMock,
    updateVehicle: updateVehicleMock,
    deleteVehicle: deleteVehicleMock,
    purchaseVehicle: async (id: string) => {
      const updated = await purchaseImpl(id);
      vehiclesState = vehiclesState.map((vehicle) => (vehicle.id === id ? updated : vehicle));
      return updated;
    },
    restockVehicle: vi.fn(),
  }),
}));

function makeVehicle(overrides: Partial<Vehicle> = {}): Vehicle {
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
    ...overrides,
  };
}

describe("InventoryPage purchase behavior", () => {
  beforeEach(() => {
    showToastMock.mockReset();
    refetchMock.mockReset();
    createVehicleMock.mockReset();
    updateVehicleMock.mockReset();
    deleteVehicleMock.mockReset();
    vehiclesState = [makeVehicle()];
    purchaseImpl = vi.fn(async () => makeVehicle({ quantity: 1 }));
  });

  it("disables purchase and shows out-of-stock label when quantity is zero", () => {
    vehiclesState = [makeVehicle({ quantity: 0 })];
    render(<InventoryPage />);

    const purchaseButton = screen.getByRole("button", { name: /purchase/i });
    expect(purchaseButton).toBeDisabled();
    expect(screen.getByText(/out of stock/i)).toBeInTheDocument();
  });

  it("calls purchase API, updates quantity, and shows success toast", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<InventoryPage />);

    await user.click(screen.getByRole("button", { name: /purchase/i }));

    await waitFor(() => {
      expect(showToastMock).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: "success",
          title: "Purchase completed",
        })
      );
    });

    rerender(<InventoryPage />);
    expect(screen.getByText("Quantity: 1")).toBeInTheDocument();
  });

  it("shows an error toast and refreshes data when purchase fails with 400/409", async () => {
    purchaseImpl = vi.fn(async () => {
      throw new ApiError("Vehicle is out of stock.", 409);
    });

    const user = userEvent.setup();
    render(<InventoryPage />);

    await user.click(screen.getByRole("button", { name: /purchase/i }));

    await waitFor(() => {
      expect(showToastMock).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: "error",
          title: "Vehicle is out of stock",
        })
      );
    });

    expect(refetchMock).toHaveBeenCalledTimes(1);
  });
});
