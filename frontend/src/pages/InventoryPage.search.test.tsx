import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import { InventoryPage } from "./InventoryPage";
import type { VehicleFilters } from "../types/vehicle";

const capturedCalls: Array<{ filters: VehicleFilters; options?: { useSearchEndpoint?: boolean } }> = [];

vi.mock("../layouts/DashboardLayout", () => ({
  DashboardLayout: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock("../components/VehicleFormModal", () => ({
  VehicleFormModal: () => null,
}));

vi.mock("../components/ConfirmDialog", () => ({
  ConfirmDialog: () => null,
}));

vi.mock("../hooks/useToast", () => ({
  useToast: () => ({ showToast: vi.fn() }),
}));

vi.mock("../hooks/useAuth", () => ({
  useAuth: () => ({ user: { role: "admin" } }),
}));

vi.mock("../hooks/useDebounce", () => ({
  useDebounce: (value: string) => value,
}));

vi.mock("../hooks/useVehicles", () => ({
  useVehicles: (filters: VehicleFilters, options?: { useSearchEndpoint?: boolean }) => {
    capturedCalls.push({ filters, options });
    return {
      vehicles: [],
      total: 0,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
      createVehicle: vi.fn(),
      updateVehicle: vi.fn(),
      deleteVehicle: vi.fn(),
      purchaseVehicle: vi.fn(),
      restockVehicle: vi.fn(),
    };
  },
}));

describe("InventoryPage search endpoint filters", () => {
  beforeEach(() => {
    capturedCalls.length = 0;
  });

  it("sends make/model/category/minPrice/maxPrice combined filters to useVehicles search mode", async () => {
    const user = userEvent.setup();
    render(<InventoryPage />);

    await user.type(screen.getByLabelText(/^make$/i), "Toyota");
    await user.type(screen.getByLabelText(/^model$/i), "Camry");
    await user.selectOptions(screen.getByRole("combobox"), "Sedan");
    await user.type(screen.getByLabelText(/min price/i), "24000");
    await user.type(screen.getByLabelText(/max price/i), "36000");

    await waitFor(() => {
      const latest = capturedCalls.at(-1);
      expect(latest?.options).toEqual({ useSearchEndpoint: true });
      expect(latest?.filters).toMatchObject({
        make: "Toyota",
        model: "Camry",
        category: "Sedan",
        minPrice: 24000,
        maxPrice: 36000,
      });
    });
  });
});
