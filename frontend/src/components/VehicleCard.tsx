import type { Vehicle } from "../types/vehicle";
import { Card } from "./Card";
import { StatusBadge } from "./StatusBadge";
import { Button } from "./Button";
import { formatCurrency } from "../utils/format";
import { handleImageError, DEFAULT_CAR_IMAGE } from "../utils/images";

interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
  onPurchase: (vehicle: Vehicle) => void;
  onRestock?: (vehicle: Vehicle) => void;
  onInspect?: (vehicle: Vehicle) => void;
  isPurchasing?: boolean;
  canManage?: boolean;
}

export function VehicleCard({
  vehicle,
  onEdit,
  onDelete,
  onPurchase,
  onRestock,
  onInspect,
  isPurchasing = false,
  canManage = false,
}: VehicleCardProps) {
  const isOutOfStock = vehicle.quantity <= 0;
  const isLowStock = vehicle.quantity > 0 && vehicle.quantity < 3;

  return (
    <Card hoverable className={`flex flex-col overflow-hidden ${isLowStock ? "ring-1 ring-amber-500/50" : ""}`}>
      {/* Image section */}
      <div
        className="relative h-44 w-full overflow-hidden bg-surface-container cursor-pointer group"
        onClick={() => onInspect?.(vehicle)}
      >
        <img
          src={vehicle.image || DEFAULT_CAR_IMAGE}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={handleImageError}
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="rounded-full bg-white/90 px-md py-xs text-label-sm font-semibold text-on-surface shadow-md">
            Inspect Specs &rarr;
          </span>
        </div>
        <div className="absolute right-sm top-sm flex items-center gap-xs">
          {isLowStock && (
            <span
              data-testid="low-stock-badge"
              className="inline-flex items-center rounded-full bg-amber-500 px-md py-xs text-label-sm font-semibold uppercase tracking-wide text-white shadow-sm"
            >
              Low Stock ({vehicle.quantity} left)
            </span>
          )}
          <StatusBadge status={vehicle.status} />
        </div>
        {/* Fuel type pill */}
        <div className="absolute left-sm bottom-sm">
          <span className="inline-flex items-center rounded-full bg-black/60 px-sm py-xs text-[10px] font-medium uppercase tracking-wider text-white backdrop-blur-sm">
            {vehicle.fuelType === "Electric" && "⚡ "}
            {vehicle.fuelType === "Hybrid" && "🍃 "}
            {vehicle.fuelType}
          </span>
        </div>
      </div>

      {/* Details section */}
      <div className="flex flex-1 flex-col p-md">
        <p className="text-label-sm uppercase tracking-wide text-primary">
          {vehicle.category} &bull; {vehicle.dealerId}
        </p>
        <h3 className="mt-xs text-title-lg text-on-surface">
          {vehicle.make} {vehicle.model}
        </h3>
        <p className="text-body-md text-on-surface-variant">
          {vehicle.trim} &bull; {vehicle.year}
        </p>

        {/* Color & transmission */}
        {(vehicle.color || vehicle.transmission) && (
          <div className="mt-sm flex flex-wrap gap-xs">
            {vehicle.color && (
              <span className="inline-flex items-center gap-xs rounded-full bg-surface-container px-sm py-xs text-[10px] font-medium text-on-surface-variant">
                <span className="material-symbols-outlined text-[12px]">palette</span>
                {vehicle.color}
              </span>
            )}
            {vehicle.transmission && (
              <span className="inline-flex items-center gap-xs rounded-full bg-surface-container px-sm py-xs text-[10px] font-medium text-on-surface-variant">
                <span className="material-symbols-outlined text-[12px]">settings</span>
                {vehicle.transmission.replace("Automatic", "Auto").replace("Manual", "Manual").replace("Single-Speed Direct Drive", "Direct")}
              </span>
            )}
          </div>
        )}

        <p className="mt-md text-label-sm uppercase tracking-wide text-on-surface-variant">Fleet Value</p>
        <p className="text-headline-md text-on-surface">{formatCurrency(vehicle.price)}</p>

        <div className="mt-sm flex items-center justify-between text-label-md">
          <span className="text-on-surface-variant">Quantity: {vehicle.quantity}</span>
          {isOutOfStock && <span className="font-semibold text-error">Out of Stock</span>}
          {vehicle.mileage > 0 && (
            <span className="text-on-surface-variant">{vehicle.mileage.toLocaleString()} mi</span>
          )}
        </div>

        {/* Action buttons */}
        <div className="mt-md flex flex-col gap-sm">
          <Button variant="primary" onClick={() => onPurchase(vehicle)} disabled={isOutOfStock} isLoading={isPurchasing}>
            Purchase
          </Button>
          {canManage && (
            <>
              <Button variant="secondary" size="sm" onClick={() => onRestock?.(vehicle)}>
                <span className="material-symbols-outlined text-[16px]">add_box</span>
                Restock
              </Button>
              <div className="flex gap-sm">
                <Button variant="secondary" size="sm" className="flex-1" onClick={() => onEdit(vehicle)}>
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                  Edit
                </Button>
                <Button variant="danger" size="sm" className="flex-1" onClick={() => onDelete(vehicle)}>
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                  Delete
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
