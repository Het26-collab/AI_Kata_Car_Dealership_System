import type { Vehicle } from "../types/vehicle";
import { StatusBadge } from "./StatusBadge";
import { formatCurrency, formatDate, maskVin } from "../utils/format";
import { handleImageError, DEFAULT_CAR_IMAGE } from "../utils/images";

interface VehicleTableProps {
  vehicles: Vehicle[];
  onRowClick?: (vehicle: Vehicle) => void;
}

export function VehicleTable({ vehicles, onRowClick }: VehicleTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-surface-container-low">
          <tr>
            <th className="px-lg py-md text-label-sm uppercase tracking-wider text-on-surface-variant">
              Vehicle
            </th>
            <th className="hidden px-lg py-md text-label-sm uppercase tracking-wider text-on-surface-variant sm:table-cell">
              VIN
            </th>
            <th className="px-lg py-md text-label-sm uppercase tracking-wider text-on-surface-variant">
              Category
            </th>
            <th className="px-lg py-md text-label-sm uppercase tracking-wider text-on-surface-variant">
              Price
            </th>
            <th className="px-lg py-md text-label-sm uppercase tracking-wider text-on-surface-variant">
              Status
            </th>
            <th className="px-lg py-md text-right text-label-sm uppercase tracking-wider text-on-surface-variant">
              Updated
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/40">
          {vehicles.map((vehicle) => (
            <tr
              key={vehicle.id}
              className={`transition-all duration-150 ${onRowClick ? "cursor-pointer hover:bg-surface-container-low hover:shadow-sm" : ""}`}
              onClick={() => onRowClick?.(vehicle)}
            >
              <td className="px-lg py-md">
                <div className="flex items-center gap-md">
                  <img
                    src={vehicle.image || DEFAULT_CAR_IMAGE}
                    alt=""
                    className="h-10 w-10 rounded-md object-cover"
                    onError={handleImageError}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div>
                    <p className="text-body-md font-medium text-on-surface">
                      {vehicle.make} {vehicle.model}
                    </p>
                    <p className="text-label-md text-on-surface-variant sm:hidden">{maskVin(vehicle.vin)}</p>
                  </div>
                </div>
              </td>
              <td className="hidden px-lg py-md text-body-md text-on-surface-variant sm:table-cell">
                {maskVin(vehicle.vin)}
              </td>
              <td className="px-lg py-md text-body-md text-on-surface-variant">{vehicle.category}</td>
              <td className="px-lg py-md text-body-md font-medium text-on-surface">
                {formatCurrency(vehicle.price)}
              </td>
              <td className="px-lg py-md">
                <StatusBadge status={vehicle.status} />
              </td>
              <td className="px-lg py-md text-right text-body-md text-on-surface-variant">
                {formatDate(vehicle.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
