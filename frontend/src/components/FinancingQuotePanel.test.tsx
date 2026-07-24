import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { FinancingQuotePanel } from "./FinancingQuotePanel";
import { vehicleService } from "../services/vehicleService";
import type { Vehicle } from "../types/vehicle";

vi.mock("../services/vehicleService", () => ({
  vehicleService: {
    downloadQuote: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock("../hooks/useToast", () => ({
  useToast: () => ({ showToast: vi.fn() }),
}));

const mockVehicle: Vehicle = {
  id: "v-999",
  make: "Audi",
  model: "RS6 Avant",
  trim: "Performance",
  year: 2025,
  category: "Performance",
  dealerId: "D-100",
  vin: "WAUZZZ4K9P123456",
  price: 120000,
  quantity: 2,
  status: "In Stock",
  image: "https://example.com/rs6.jpg",
  mileage: 0,
  color: "Nardo Gray",
  fuelType: "Gasoline",
  transmission: "Automatic",
  description: "High-performance wagon",
  createdAt: "2025-01-01",
};

describe("FinancingQuotePanel Component Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates estimated monthly payment when down payment, term, or credit tier changes", async () => {
    const user = userEvent.setup();
    render(<FinancingQuotePanel vehicle={mockVehicle} />);

    // Initial default: vehiclePrice = 120000, downPayment = 12000 (10%), term = 60, tier = prime (5.9%)
    // Principal = 108000
    const paymentDisplay = screen.getByTestId("monthly-payment-display");
    expect(paymentDisplay.textContent).toMatch(/\$2,082|\$2,083/);

    // Change down payment to 40000
    const downInput = screen.getByTestId("down-payment-input");
    await user.clear(downInput);
    await user.type(downInput, "40000");

    // Principal = 80000, term = 60, tier = prime (5.9%) -> ~$1,543/mo
    expect(paymentDisplay.textContent).toMatch(/\$1,54[23]/);

    // Change credit tier to "subprime" (15.9%)
    const tierSelect = screen.getByTestId("credit-tier-select");
    await user.selectOptions(tierSelect, "subprime");

    // Monthly payment should increase for subprime -> $1,941/mo
    expect(paymentDisplay.textContent).toMatch(/\$1,941/);
  });

  it("triggers vehicleService.downloadQuote with correct payload when Download button is clicked", async () => {
    const user = userEvent.setup();
    render(<FinancingQuotePanel vehicle={mockVehicle} />);

    const downloadBtn = screen.getByTestId("download-pdf-btn");
    await user.click(downloadBtn);

    await waitFor(() => {
      expect(vehicleService.downloadQuote).toHaveBeenCalledWith(
        "v-999",
        expect.objectContaining({
          downPayment: 12000,
          termMonths: 60,
          creditTier: "prime",
          tradeInValue: 0,
        })
      );
    });
  });
});
