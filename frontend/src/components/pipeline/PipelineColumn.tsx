import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Vehicle } from "../../types/vehicle";
import { SortableVehicleCard } from "./SortableVehicleCard";
import { Skeleton } from "../Skeleton";

interface PipelineColumnProps {
  id: string;
  title: string;
  items: Vehicle[];
  isLoading: boolean;
}

const COLUMN_COLORS: Record<string, string> = {
  "In Transit": "bg-blue-500",
  "In Stock": "bg-green-500",
  "Reserved": "bg-amber-500",
};

export function PipelineColumn({ id, title, items, isLoading }: PipelineColumnProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="flex flex-col flex-1 rounded-xl border border-outline-variant bg-surface-container-low shadow-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-md py-sm">
        <div className="flex items-center gap-xs">
          <span className={`h-2.5 w-2.5 rounded-full ${COLUMN_COLORS[title] || "bg-primary"}`} />
          <h3 className="text-title-md font-bold text-on-surface">{title}</h3>
        </div>
        <span className="rounded-full bg-surface-container px-sm py-[2px] text-label-sm font-semibold text-on-surface-variant">
          {items.length} units
        </span>
      </div>

      <div
        ref={setNodeRef}
        className="flex flex-col gap-sm p-sm flex-1 overflow-y-auto scrollbar-thin"
      >
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
        ) : items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center p-lg text-center border-2 border-dashed border-outline-variant rounded-lg">
            <span className="text-body-md text-on-surface-variant font-medium">Drop vehicles here</span>
          </div>
        ) : (
          <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            {items.map((vehicle) => (
              <SortableVehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </SortableContext>
        )}
      </div>
    </div>
  );
}
