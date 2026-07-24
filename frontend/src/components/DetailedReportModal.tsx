import { Modal } from "./Modal";
import { Button } from "./Button";
import { formatCurrency, formatNumber } from "../utils/format";
import type { FleetStats, InventoryMixEntry } from "../types/vehicle";
import type { Vehicle } from "../types/vehicle";
import { exportVehiclesToCsv } from "../utils/export";

interface DetailedReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: FleetStats | null;
  vehicles: Vehicle[];
}

export function DetailedReportModal({ isOpen, onClose, stats, vehicles }: DetailedReportModalProps) {
  if (!stats) return null;

  function handleExportCategoryReport() {
    exportVehiclesToCsv(vehicles, "detailed-fleet-report.csv");
  }

  const totalUnits = stats.inventoryMix.reduce((sum, item) => sum + item.units, 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detailed Inventory Analysis Report" size="lg">
      <div className="flex flex-col gap-lg">
        {/* Key Metrics Overview */}
        <div className="grid grid-cols-2 gap-md sm:grid-cols-4">
          <div className="rounded-md border border-outline-variant bg-surface-container-low p-md">
            <p className="text-label-sm text-on-surface-variant uppercase tracking-wider">Total Models</p>
            <p className="text-headline-sm text-on-surface font-semibold">{formatNumber(stats.totalModels)}</p>
          </div>
          <div className="rounded-md border border-outline-variant bg-surface-container-low p-md">
            <p className="text-label-sm text-on-surface-variant uppercase tracking-wider">Total Units</p>
            <p className="text-headline-sm text-on-surface font-semibold">{formatNumber(stats.totalVehicles)}</p>
          </div>
          <div className="rounded-md border border-outline-variant bg-surface-container-low p-md">
            <p className="text-label-sm text-on-surface-variant uppercase tracking-wider">Low Stock</p>
            <p className="text-headline-sm text-amber-600 font-semibold">{formatNumber(stats.lowStock)}</p>
          </div>
          <div className="rounded-md border border-outline-variant bg-surface-container-low p-md">
            <p className="text-label-sm text-on-surface-variant uppercase tracking-wider">Portfolio Valuation</p>
            <p className="text-headline-sm text-primary font-semibold">{formatCurrency(stats.totalValue)}</p>
          </div>
        </div>

        {/* Category Breakdown Table */}
        <div>
          <h4 className="text-title-md font-semibold text-on-surface mb-sm">Inventory Mix Breakdown</h4>
          <div className="overflow-x-auto rounded-md border border-outline-variant">
            <table className="w-full text-left text-body-md">
              <thead className="bg-surface-container-low text-label-sm uppercase tracking-wider text-on-surface-variant">
                <tr>
                  <th className="px-md py-sm">Category</th>
                  <th className="px-md py-sm">Units</th>
                  <th className="px-md py-sm">% of Mix</th>
                  <th className="px-md py-sm">Avg Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {stats.inventoryMix.map((item: InventoryMixEntry) => {
                  const categoryVehicles = vehicles.filter((v) => v.category.toLowerCase() === item.category.toLowerCase());
                  const calculatedAvg = categoryVehicles.length
                    ? Math.round(categoryVehicles.reduce((sum, v) => sum + v.price, 0) / categoryVehicles.length)
                    : 0;
                  const avgPrice = item.avgPrice ?? calculatedAvg;
                  const pct = totalUnits > 0 ? Math.round((item.units / totalUnits) * 100) : 0;

                  return (
                    <tr key={item.category} className="hover:bg-surface-container-lowest transition-colors">
                      <td className="px-md py-sm font-medium text-on-surface">{item.category}</td>
                      <td className="px-md py-sm text-on-surface-variant">{item.units}</td>
                      <td className="px-md py-sm text-on-surface-variant">{pct}%</td>
                      <td className="px-md py-sm font-medium text-on-surface">{formatCurrency(avgPrice)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-between pt-md border-t border-outline-variant">
          <Button variant="secondary" onClick={handleExportCategoryReport}>
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export CSV
          </Button>
          <Button onClick={onClose}>Close Report</Button>
        </div>
      </div>
    </Modal>
  );
}
