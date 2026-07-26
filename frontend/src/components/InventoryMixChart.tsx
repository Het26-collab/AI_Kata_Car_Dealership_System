import { motion, useReducedMotion } from "motion/react";
import type { InventoryMixEntry } from "../types/vehicle";

export function InventoryMixChart({ data }: { data: InventoryMixEntry[] }) {
  const max = Math.max(1, ...data.map((d) => d.units));
  const prefersReduced = useReducedMotion();

  return (
    <div className="flex flex-col gap-md">
      {data.map((entry, i) => (
        <div key={entry.category}>
          <div className="mb-xs flex items-center justify-between text-body-md">
            <span className="font-medium text-on-surface">{entry.category}</span>
            <span className="text-on-surface-variant">{entry.units} units</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-high">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={!prefersReduced ? { width: 0 } : undefined}
              animate={{ width: `${(entry.units / max) * 100}%` }}
              transition={
                !prefersReduced
                  ? { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }
                  : { duration: 0 }
              }
            />
          </div>
        </div>
      ))}
    </div>
  );
}
