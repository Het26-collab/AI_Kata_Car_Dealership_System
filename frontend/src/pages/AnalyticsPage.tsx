import { DashboardLayout } from "../layouts/DashboardLayout";
import { KpiCard } from "../components/KpiCard";
import { InventoryMixChart } from "../components/InventoryMixChart";
import { Skeleton } from "../components/Skeleton";
import { useFleetStats } from "../hooks/useFleetStats";
import { formatNumber } from "../utils/format";

export function AnalyticsPage() {
  const { stats, isLoading } = useFleetStats();

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-headline-md text-on-surface">Analytics</h1>
        <p className="text-body-md text-on-surface-variant">Deeper insight into fleet composition and turnover.</p>
      </div>

      {isLoading || !stats ? (
        <Skeleton className="h-64" />
      ) : (
        <div className="grid grid-cols-1 gap-lg lg:grid-cols-3">
          <div className="grid grid-cols-2 gap-md lg:col-span-1">
            <KpiCard icon="directions_car" label="Total Vehicles" value={formatNumber(stats.totalVehicles)} tone="primary" />
            <KpiCard icon="check_circle" label="Available" value={formatNumber(stats.available)} tone="success" />
          </div>
          <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-lg shadow-card lg:col-span-2">
            <h3 className="text-title-lg text-on-surface">Inventory Mix by Category</h3>
            <div className="mt-md">
              <InventoryMixChart data={stats.inventoryMix} />
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
