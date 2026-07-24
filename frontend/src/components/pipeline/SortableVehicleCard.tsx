import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Vehicle } from "../../types/vehicle";
import { formatCurrency } from "../../utils/format";
import { StatusBadge } from "../StatusBadge";

interface SortableVehicleCardProps {
  vehicle: Vehicle;
  isOverlay?: boolean;
}

export function SortableVehicleCard({ vehicle, isOverlay }: SortableVehicleCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: vehicle.id,
    data: {
      type: "Vehicle",
      vehicle,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group relative flex cursor-grab flex-col rounded-xl border border-outline-variant bg-surface-container-lowest p-sm shadow-sm transition-all hover:shadow-md hover:ring-1 hover:ring-primary/40 active:cursor-grabbing ${
        isOverlay ? "scale-105 shadow-xl ring-2 ring-primary z-50 cursor-grabbing" : ""
      }`}
    >
      <div className="flex gap-sm">
        <div className="h-16 w-24 shrink-0 overflow-hidden rounded-md border border-outline-variant bg-surface-container">
          <img src={vehicle.image} alt={vehicle.model} className="h-full w-full object-cover" draggable={false} />
        </div>
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex items-center justify-between gap-xs">
            <h4 className="text-body-md font-bold text-on-surface truncate">{vehicle.year} {vehicle.make}</h4>
            <span className="text-label-sm font-extrabold text-primary shrink-0">{formatCurrency(vehicle.price)}</span>
          </div>
          <p className="text-label-sm text-on-surface-variant truncate">{vehicle.model} {vehicle.trim}</p>
          <div className="mt-auto flex items-center justify-between pt-xs">
            <StatusBadge status={vehicle.status} />
            <span className="text-label-sm font-semibold text-on-surface-variant bg-surface-container px-xs py-[2px] rounded">
              {vehicle.quantity} qty
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
