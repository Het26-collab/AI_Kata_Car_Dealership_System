import type { InventoryMixEntry } from "../types/vehicle";

export function InventoryMixChart({ data }: { data: InventoryMixEntry[] }) {
  const max = Math.max(1, ...data.map((d) => d.units));

  return (
    <div className="flex flex-col gap-md">
      {data.map((entry) => (
        <div key={entry.category}>
          <div className="mb-xs flex items-center justify-between text-body-md">
            <span className="font-medium text-on-surface">{entry.category}</span>
            <span className="text-on-surface-variant">{entry.units} units</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-high">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${(entry.units / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
