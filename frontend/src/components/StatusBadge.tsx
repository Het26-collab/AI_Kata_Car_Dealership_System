import type { VehicleStatus } from "../types/vehicle";

const STATUS_STYLES: Record<VehicleStatus, string> = {
  "In Stock": "bg-success-container text-on-success-container",
  Reserved: "bg-warning-container text-on-warning-container",
  "In Transit": "bg-primary-container text-on-primary-container",
  Sold: "bg-surface-container-high text-on-surface-variant",
};

export function StatusBadge({ status }: { status: VehicleStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-md py-xs text-label-sm uppercase tracking-wide ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}
