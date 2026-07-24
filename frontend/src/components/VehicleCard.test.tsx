import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { VehicleCard } from "./VehicleCard";

const sampleVehicle = {
  id: "v-1",
  vin: "VIN1234567890",
  dealerId: "D-100",
  make: "Toyota",
  model: "Camry",
  trim: "LE",
  year: 2024,
  category: "Sedan" as const,
  price: 29000,
  quantity: 2,
  status: "In Stock" as const,
  image: "https://example.com/image.jpg",
  mileage: 0,
  color: "White",
  fuelType: "Gasoline",
  transmission: "Automatic",
  description: "Test vehicle",
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01",
};

describe("VehicleCard Low-Stock Indicator", () => {
  it("renders low-stock badge when vehicle quantity is less than 3", () => {
    render(
      <VehicleCard
        vehicle={{ ...sampleVehicle, quantity: 2 }}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onPurchase={vi.fn()}
      />
    );

    expect(screen.getByTestId("low-stock-badge")).toBeInTheDocument();
    expect(screen.getByText(/low stock/i)).toBeInTheDocument();
  });

  it("does not render low-stock badge when vehicle quantity is 3 or more", () => {
    render(
      <VehicleCard
        vehicle={{ ...sampleVehicle, quantity: 5 }}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onPurchase={vi.fn()}
      />
    );

    expect(screen.queryByTestId("low-stock-badge")).not.toBeInTheDocument();
    expect(screen.queryByText(/low stock/i)).not.toBeInTheDocument();
  });
});
