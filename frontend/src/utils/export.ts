import type { Vehicle } from "../types/vehicle";

export function exportVehiclesToCsv(vehicles: Vehicle[], filename = "fleet-inventory.csv") {
  if (!vehicles || vehicles.length === 0) return;

  const headers = [
    "ID",
    "Make",
    "Model",
    "Trim",
    "Year",
    "Category",
    "VIN",
    "Dealer ID",
    "Price",
    "Quantity",
    "Status",
    "Mileage",
    "Color",
    "Fuel Type",
    "Transmission",
  ];

  const rows = vehicles.map((v) => [
    v.id,
    `"${(v.make || "").replace(/"/g, '""')}"`,
    `"${(v.model || "").replace(/"/g, '""')}"`,
    `"${(v.trim || "").replace(/"/g, '""')}"`,
    v.year,
    `"${(v.category || "").replace(/"/g, '""')}"`,
    `"${(v.vin || "").replace(/"/g, '""')}"`,
    `"${(v.dealerId || "").replace(/"/g, '""')}"`,
    v.price,
    v.quantity,
    `"${(v.status || "").replace(/"/g, '""')}"`,
    v.mileage || 0,
    `"${(v.color || "").replace(/"/g, '""')}"`,
    `"${(v.fuelType || "").replace(/"/g, '""')}"`,
    `"${(v.transmission || "").replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
