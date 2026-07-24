import { useState } from "react";
import type { Vehicle } from "../types/vehicle";
import { formatCurrency, maskVin, formatDate } from "../utils/format";
import { StatusBadge } from "./StatusBadge";
import { Button } from "./Button";
import { DEFAULT_CAR_IMAGE, handleImageError } from "../utils/images";
import { useAuth } from "../hooks/useAuth";
import { FinancingQuotePanel } from "./FinancingQuotePanel";

interface VehicleDetailsDrawerProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (vehicle: Vehicle) => void;
  onRestock?: (vehicle: Vehicle) => void;
  isPurchasing?: boolean;
}

export function VehicleDetailsDrawer({
  vehicle,
  isOpen,
  onClose,
  onPurchase,
  onRestock,
  isPurchasing = false,
}: VehicleDetailsDrawerProps) {
  if (!isOpen || !vehicle) return null;

  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [downPayment, setDownPayment] = useState<number>(5000);
  const [loanTerm, setLoanTerm] = useState<number>(60);

  // Financial Estimation
  const principal = Math.max(0, vehicle.price - downPayment);
  const interestRate = 0.059 / 12; // 5.9% APR
  const estimatedMonthly =
    principal > 0
      ? Math.round((principal * (interestRate * Math.pow(1 + interestRate, loanTerm))) / (Math.pow(1 + interestRate, loanTerm) - 1))
      : 0;

  const isOutOfStock = vehicle.quantity <= 0;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Slide-out Panel */}
      <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col border-l border-outline-variant bg-surface-container-lowest shadow-2xl transition-transform duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-outline-variant p-lg">
          <div>
            <span className="text-label-sm font-semibold uppercase tracking-wider text-primary">{vehicle.category}</span>
            <h2 className="text-headline-sm font-bold text-on-surface">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h2>
            <p className="text-body-md text-on-surface-variant">{vehicle.trim}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-xs text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-lg space-y-lg">
          {/* Hero Image */}
          <div className="relative h-56 w-full overflow-hidden rounded-xl bg-surface-container border border-outline-variant/60">
            <img
              src={vehicle.image || DEFAULT_CAR_IMAGE}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="h-full w-full object-cover"
              onError={handleImageError}
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-md right-md">
              <StatusBadge status={vehicle.status} />
            </div>
            <div className="absolute bottom-md left-md rounded-lg bg-black/60 backdrop-blur-md px-md py-xs text-white">
              <p className="text-label-sm uppercase tracking-wide opacity-80">MSRP Price</p>
              <p className="text-title-lg font-bold">{formatCurrency(vehicle.price)}</p>
            </div>
          </div>

          {/* Quick Specs Grid */}
          <div>
            <h3 className="text-title-md font-bold text-on-surface mb-sm">Technical Specifications</h3>
            <div className="grid grid-cols-2 gap-md rounded-xl border border-outline-variant bg-surface-container-low p-md">
              <div>
                <p className="text-label-sm text-on-surface-variant uppercase">VIN</p>
                <p className="text-body-md font-mono font-semibold text-on-surface">{maskVin(vehicle.vin)}</p>
              </div>
              <div>
                <p className="text-label-sm text-on-surface-variant uppercase">Mileage</p>
                <p className="text-body-md font-semibold text-on-surface">
                  {vehicle.mileage ? `${vehicle.mileage.toLocaleString()} mi` : "Brand New (0 mi)"}
                </p>
              </div>
              <div>
                <p className="text-label-sm text-on-surface-variant uppercase">Powertrain</p>
                <p className="text-body-md font-semibold text-on-surface">{vehicle.fuelType || "Gasoline"}</p>
              </div>
              <div>
                <p className="text-label-sm text-on-surface-variant uppercase">Transmission</p>
                <p className="text-body-md font-semibold text-on-surface">{vehicle.transmission || "Automatic"}</p>
              </div>
              <div>
                <p className="text-label-sm text-on-surface-variant uppercase">Exterior Color</p>
                <p className="text-body-md font-semibold text-on-surface">{vehicle.color || "Standard Finish"}</p>
              </div>
              <div>
                <p className="text-label-sm text-on-surface-variant uppercase">Stock Quantity</p>
                <p className={`text-body-md font-bold ${vehicle.quantity > 0 ? "text-emerald-600" : "text-error"}`}>
                  {vehicle.quantity} {vehicle.quantity === 1 ? "unit" : "units"} available
                </p>
              </div>
            </div>
          </div>

          {/* Financing Quote & Loan Estimator */}
          <FinancingQuotePanel vehicle={vehicle} />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-md border-t border-outline-variant p-lg bg-surface-container-lowest">
          {isAdmin && onRestock && (
            <Button variant="secondary" onClick={() => onRestock(vehicle)} className="flex-1 justify-center">
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              Restock
            </Button>
          )}

          <Button
            variant="primary"
            onClick={() => onPurchase(vehicle)}
            disabled={isOutOfStock || isPurchasing}
            isLoading={isPurchasing}
            className="flex-1 justify-center"
          >
            <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
            {isOutOfStock ? "Out of Stock" : "Purchase Unit"}
          </Button>
        </div>
      </aside>
    </>
  );
}
