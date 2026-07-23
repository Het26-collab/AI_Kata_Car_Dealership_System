import type { Vehicle } from "../types/vehicle";
import { Card } from "./Card";
import { StatusBadge } from "./StatusBadge";
import { Button } from "./Button";
import { formatCurrency } from "../utils/format";

interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
  onPurchase: (vehicle: Vehicle) => void;
  onRestock?: (vehicle: Vehicle) => void;
  isPurchasing?: boolean;
  canManage?: boolean;
}

export function VehicleCard({
  vehicle,
  onEdit,
  onDelete,
  onPurchase,
  onRestock,
  isPurchasing = false,
  canManage = false,
}: VehicleCardProps) {
  const isOutOfStock = vehicle.quantity <= 0;
  const isLowStock = vehicle.quantity > 0 && vehicle.quantity < 3;

  return (
    <Card hoverable className={`flex flex-col overflow-hidden ${isLowStock ? "ring-1 ring-amber-500/50" : ""}`}>
      <div className="relative h-44 w-full overflow-hidden bg-surface-container">
        <img
          src={vehicle.image}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          className="h-full w-full object-cover"
          loading="lazy"
        />
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
      </div>
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
        <p className="mt-md text-label-sm uppercase tracking-wide text-on-surface-variant">Fleet Value</p>
        <p className="text-headline-md text-on-surface">{formatCurrency(vehicle.price)}</p>

        <div className="mt-sm flex items-center justify-between text-label-md">
          <span className="text-on-surface-variant">Quantity: {vehicle.quantity}</span>
          {isOutOfStock && <span className="font-semibold text-error">Out of Stock</span>}
        </div>

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
              <Button variant="primary" onClick={() => onEdit(vehicle)}>
                View Details
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
