import { useState } from "react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { KpiCard } from "../components/KpiCard";
import { InventoryMixChart } from "../components/InventoryMixChart";
import { SalesBarChart } from "../components/SalesBarChart";
import { VehicleTable } from "../components/VehicleTable";
import { Skeleton } from "../components/Skeleton";
import { Button } from "../components/Button";
import { useFleetStats } from "../hooks/useFleetStats";
import { useVehicles } from "../hooks/useVehicles";
import { formatNumber } from "../utils/format";
import { VehicleFormModal } from "../components/VehicleFormModal";
import { useToast } from "../hooks/useToast";
import { useAuth } from "../hooks/useAuth";
import type { Vehicle, VehicleDraft } from "../types/vehicle";

// The backend seed data doesn't track historical monthly sales, so this
// series is illustrative demo data (shaped like the original Stitch mockup)
// rather than derived from the live API. A real deployment would replace
// this with a `/api/vehicles/sales-history` endpoint.
const MONTHLY_SALES = [
  { label: "Jan", value: 62 },
  { label: "Feb", value: 78 },
  { label: "Mar", value: 70 },
  { label: "Apr", value: 118 },
  { label: "May", value: 88 },
  { label: "Jun", value: 132 },
  { label: "Jul", value: 96 },
];

export function DashboardPage() {
  const { stats, isLoading: statsLoading } = useFleetStats();
  const { vehicles, isLoading: vehiclesLoading, createVehicle } = useVehicles({ sort: "newest" });
  const { showToast } = useToast();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [isAddOpen, setIsAddOpen] = useState(false);

  async function handleCreate(draft: VehicleDraft) {
    await createVehicle(draft);
    showToast({
      variant: "success",
      title: "Vehicle added successfully",
      description: `${draft.year} ${draft.make} ${draft.model} was saved to Global Motors.`,
    });
  }

  return (
    <DashboardLayout onAddVehicle={isAdmin ? () => setIsAddOpen(true) : undefined}>
      <div className="flex flex-col gap-md sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-headline-md text-on-surface">Fleet Overview</h1>
          <p className="text-body-md text-on-surface-variant">Real-time status of dealership performance metrics.</p>
        </div>
        <div className="flex items-center gap-sm">
          <Button variant="secondary" size="sm">
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            Last 30 Days
          </Button>
          <Button size="sm">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-4">
        {statsLoading || !stats ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />)
        ) : (
          <>
            <KpiCard icon="directions_car" label="Total Vehicles" value={formatNumber(stats.totalVehicles)} tone="primary" />
            <KpiCard
              icon="check_circle"
              label="Available"
              value={formatNumber(stats.available)}
              tone="success"
              trailing={<span className="text-label-md text-on-surface-variant">{stats.availablePct}% of total</span>}
            />
            <KpiCard icon="warning" label="Low Stock" value={formatNumber(stats.lowStock)} tone="warning" />
            <KpiCard icon="shopping_cart" label="Sold Today" value={formatNumber(stats.soldToday)} tone="primary" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-lg lg:grid-cols-3">
        <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-lg shadow-card lg:col-span-2">
          <h3 className="text-title-lg text-on-surface">Monthly Sales Performance</h3>
          <p className="text-body-md text-on-surface-variant">Units sold vs targets (Jan&ndash;Jul)</p>
          <div className="mt-md">
            <SalesBarChart data={MONTHLY_SALES} highlightLabel="Apr" />
          </div>
        </div>

        <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-lg shadow-card">
          <h3 className="text-title-lg text-on-surface">Inventory Mix</h3>
          {statsLoading || !stats ? (
            <Skeleton className="mt-md h-40" />
          ) : (
            <div className="mt-md">
              <InventoryMixChart data={stats.inventoryMix} />
            </div>
          )}
          <Button variant="secondary" className="mt-lg w-full justify-center">
            Detailed Report
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-outline-variant bg-surface-container-lowest shadow-card">
        <div className="flex items-center justify-between px-lg py-md">
          <h3 className="text-title-lg text-on-surface">Recent Activity</h3>
        </div>
        {vehiclesLoading ? (
          <div className="space-y-sm p-lg">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <VehicleTable vehicles={vehicles.slice(0, 5)} />
        )}
        <div className="border-t border-outline-variant px-lg py-md text-label-md text-on-surface-variant">
          Showing {Math.min(vehicles.length, 5)} of {vehicles.length} vehicles
        </div>
      </div>

      <VehicleFormModal isOpen={isAddOpen} vehicle={null} onClose={() => setIsAddOpen(false)} onSubmit={handleCreate} />
    </DashboardLayout>
  );
}
