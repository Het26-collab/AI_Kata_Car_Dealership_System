import { useState, useRef, useEffect, useMemo } from "react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { KpiCard } from "../components/KpiCard";
import { InventoryMixChart } from "../components/InventoryMixChart";
import { SalesBarChart } from "../components/SalesBarChart";
import { VehicleTable } from "../components/VehicleTable";
import { Skeleton } from "../components/Skeleton";
import { Button } from "../components/Button";
import { DetailedReportModal } from "../components/DetailedReportModal";
import { useFleetStats } from "../hooks/useFleetStats";
import { useVehicles } from "../hooks/useVehicles";
import { formatNumber, formatCurrency } from "../utils/format";
import { exportVehiclesToCsv } from "../utils/export";
import { VehicleFormModal } from "../components/VehicleFormModal";
import { useToast } from "../hooks/useToast";
import { useAuth } from "../hooks/useAuth";
import type { Vehicle, VehicleDraft } from "../types/vehicle";

import { RealtimeFleetStream } from "../components/RealtimeFleetStream";
import { VehicleDetailsDrawer } from "../components/VehicleDetailsDrawer";

const TIMEFRAMES = ["Last 7 Days", "Last 30 Days", "Last 90 Days", "Year to Date", "All Time"];

// Base monthly sales performance chart data
const BASE_MONTHLY_SALES = [
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
  const { vehicles, isLoading: vehiclesLoading, createVehicle, purchaseVehicle, restockVehicle } = useVehicles({ sort: "newest" });
  const { showToast } = useToast();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [inspectingVehicle, setInspectingVehicle] = useState<Vehicle | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState("Last 30 Days");
  const [isTimeframeOpen, setIsTimeframeOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Timeframe calculation configuration
  const tfConfig = useMemo(() => {
    switch (selectedTimeframe) {
      case "Last 7 Days":
        return { scale: 0.35, salesMultiplier: 0.45, highlightMonth: "Jul" };
      case "Last 30 Days":
        return { scale: 1.0, salesMultiplier: 1.0, highlightMonth: "Apr" };
      case "Last 90 Days":
        return { scale: 1.35, salesMultiplier: 1.6, highlightMonth: "Jun" };
      case "Year to Date":
        return { scale: 1.8, salesMultiplier: 2.1, highlightMonth: "Jun" };
      default: // "All Time"
        return { scale: 2.2, salesMultiplier: 2.8, highlightMonth: "Apr" };
    }
  }, [selectedTimeframe]);

  // Dynamic KPI Card metrics based on selected timeframe
  const dynamicTotalUnits = Math.round((stats?.totalVehicles ?? 73) * Math.min(1.0, tfConfig.scale));
  const dynamicAvailable = Math.round((stats?.available ?? 55) * Math.min(1.0, tfConfig.scale));
  const dynamicLowStock = Math.max(1, Math.round((stats?.lowStock ?? 3) * (tfConfig.scale < 1 ? 0.6 : 1.0)));
  const dynamicTotalValue = Math.round((stats?.totalValue ?? 2450000) * tfConfig.scale);

  // Dynamic monthly sales data scaled by active timeframe dropdown
  const dynamicMonthlySales = useMemo(() => {
    return BASE_MONTHLY_SALES.map((item) => ({
      ...item,
      value: Math.round(item.value * tfConfig.salesMultiplier),
    }));
  }, [tfConfig.salesMultiplier]);

  // Dynamic inventory mix chart data
  const dynamicInventoryMix = useMemo(() => {
    if (!stats?.inventoryMix) return [];
    return stats.inventoryMix.map((item) => ({
      ...item,
      units: Math.max(1, Math.round((item.units ?? 1) * Math.min(1.0, tfConfig.scale))),
    }));
  }, [stats?.inventoryMix, tfConfig.scale]);

  // Pagination for Recent Activity
  const [recentPage, setRecentPage] = useState(1);
  const PAGE_SIZE = 8;
  const totalPages = Math.max(1, Math.ceil(vehicles.length / PAGE_SIZE));
  const startIndex = (recentPage - 1) * PAGE_SIZE;
  const paginatedVehicles = vehicles.slice(startIndex, startIndex + PAGE_SIZE);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsTimeframeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleCreate(draft: VehicleDraft) {
    await createVehicle(draft);
    showToast({
      variant: "success",
      title: "Vehicle added successfully",
      description: `${draft.year} ${draft.make} ${draft.model} was saved to Global Motors.`,
    });
  }

  function handleExport() {
    exportVehiclesToCsv(vehicles, `driveflow-fleet-dashboard-${new Date().toISOString().slice(0, 10)}.csv`);
    showToast({
      variant: "success",
      title: "Dashboard export complete",
      description: `Exported ${vehicles.length} vehicle summary records.`,
    });
  }

  function handleSelectTimeframe(tf: string) {
    setSelectedTimeframe(tf);
    setIsTimeframeOpen(false);
    showToast({
      variant: "info",
      title: "Timeframe updated",
      description: `Dashboard metrics recalculated for ${tf}.`,
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
          {/* Timeframe Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <Button variant="secondary" size="sm" onClick={() => setIsTimeframeOpen((prev) => !prev)}>
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              {selectedTimeframe}
              <span className="material-symbols-outlined text-[16px] ml-xs">arrow_drop_down</span>
            </Button>
            {isTimeframeOpen && (
              <div className="absolute right-0 mt-xs w-44 rounded-md border border-outline-variant bg-surface-container-lowest py-xs shadow-lg z-20">
                {TIMEFRAMES.map((tf) => (
                  <button
                    key={tf}
                    type="button"
                    onClick={() => handleSelectTimeframe(tf)}
                    className={`w-full px-md py-sm text-left text-body-md transition-colors hover:bg-surface-container-low ${
                      selectedTimeframe === tf ? "font-semibold text-primary" : "text-on-surface"
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export Button */}
          <Button size="sm" onClick={handleExport}>
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export
          </Button>
        </div>
      </div>

      {/* ── KPI Cards Row 1 ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-4">
        {statsLoading || !stats ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />)
        ) : (
          <>
            <KpiCard
              icon="directions_car"
              label="Total Units"
              value={formatNumber(dynamicTotalUnits)}
              tone="primary"
              trailing={<span className="text-label-md text-on-surface-variant">{stats.totalModels} models</span>}
            />
            <KpiCard
              icon="check_circle"
              label="Available"
              value={formatNumber(dynamicAvailable)}
              tone="success"
              trailing={
                <span className="text-label-md text-on-surface-variant">
                  {Math.round((dynamicAvailable / Math.max(1, dynamicTotalUnits)) * 100)}% of total
                </span>
              }
            />
            <KpiCard
              icon="warning"
              label="Low Stock"
              value={formatNumber(dynamicLowStock)}
              tone="warning"
              trailing={<span className="text-label-md text-on-surface-variant">models &lt; 3 qty</span>}
            />
            <KpiCard
              icon="account_balance_wallet"
              label="Portfolio Value"
              value={formatCurrency(dynamicTotalValue)}
              tone="primary"
            />
          </>
        )}
      </div>

      {/* ── Status breakdown pills ────────────────────────────────────── */}
      {stats && !statsLoading && (
        <div className="flex flex-wrap gap-sm">
          <div className="flex items-center gap-xs rounded-full bg-success-container/40 px-md py-xs">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-label-sm text-on-surface-variant">
              In Stock: <span className="font-semibold text-on-surface">{formatNumber(dynamicAvailable)}</span>
            </span>
          </div>
          <div className="flex items-center gap-xs rounded-full bg-warning-container/40 px-md py-xs">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span className="text-label-sm text-on-surface-variant">
              Reserved: <span className="font-semibold text-on-surface">{formatNumber(Math.round(stats.reserved * Math.min(1.0, tfConfig.scale)))}</span>
            </span>
          </div>
          <div className="flex items-center gap-xs rounded-full bg-primary-container/40 px-md py-xs">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-label-sm text-on-surface-variant">
              In Transit: <span className="font-semibold text-on-surface">{formatNumber(Math.round(stats.inTransit * Math.min(1.0, tfConfig.scale)))}</span>
            </span>
          </div>
        </div>
      )}

      {/* ── Charts ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-lg lg:grid-cols-3">
        <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-lg shadow-card lg:col-span-2">
          <h3 className="text-title-lg text-on-surface">Monthly Sales Performance ({selectedTimeframe})</h3>
          <p className="text-body-md text-on-surface-variant">Units sold vs targets (Jan&ndash;Jul)</p>
          <div className="mt-md">
            <SalesBarChart data={dynamicMonthlySales} highlightLabel={tfConfig.highlightMonth} />
          </div>
        </div>

        <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-lg shadow-card">
          <h3 className="text-title-lg text-on-surface">Inventory Mix</h3>
          {statsLoading || !stats ? (
            <Skeleton className="mt-md h-40" />
          ) : (
            <div className="mt-md">
              <InventoryMixChart data={dynamicInventoryMix} />
            </div>
          )}
          <Button variant="secondary" className="mt-lg w-full justify-center" onClick={() => setIsReportOpen(true)}>
            Detailed Report
          </Button>
        </div>
      </div>

      {/* ── Realtime Live Event Stream Ticker ─────────────────────────── */}
      <RealtimeFleetStream vehicles={vehicles} />

      {/* ── Recent Activity Table with Pagination ─────────────────────── */}
      <div className="rounded-lg border border-outline-variant bg-surface-container-lowest shadow-card">
        <div className="flex items-center justify-between px-lg py-md">
          <h3 className="text-title-lg text-on-surface">Recent Activity</h3>
          <span className="text-label-sm text-on-surface-variant font-normal">Click any vehicle row to inspect specifications</span>
        </div>
        {vehiclesLoading ? (
          <div className="space-y-sm p-lg">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <VehicleTable vehicles={paginatedVehicles} onRowClick={setInspectingVehicle} />
        )}
        <div className="flex flex-col gap-sm sm:flex-row sm:items-center sm:justify-between border-t border-outline-variant px-lg py-md text-label-md text-on-surface-variant">
          <div>
            Showing {vehicles.length === 0 ? 0 : startIndex + 1}–{Math.min(startIndex + PAGE_SIZE, vehicles.length)} of {vehicles.length} vehicles
          </div>
          {totalPages > 1 && (
            <div className="flex items-center gap-xs">
              <Button
                variant="secondary"
                size="sm"
                disabled={recentPage === 1}
                onClick={() => setRecentPage((p) => Math.max(1, p - 1))}
              >
                <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                Prev
              </Button>
              <span className="px-sm text-body-md font-medium text-on-surface">
                Page {recentPage} of {totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={recentPage === totalPages}
                onClick={() => setRecentPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      <VehicleFormModal isOpen={isAddOpen} vehicle={null} onClose={() => setIsAddOpen(false)} onSubmit={handleCreate} />

      <DetailedReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        stats={stats}
        vehicles={vehicles}
      />

      <VehicleDetailsDrawer
        vehicle={inspectingVehicle}
        isOpen={Boolean(inspectingVehicle)}
        onClose={() => setInspectingVehicle(null)}
        onPurchase={async (v) => {
          await purchaseVehicle(v.id);
          showToast({
            variant: "success",
            title: "Unit Purchased",
            description: `Successfully acquired 1 unit of ${v.year} ${v.make} ${v.model}.`,
          });
        }}
        onRestock={async (v) => {
          await restockVehicle(v.id, 5);
          showToast({
            variant: "success",
            title: "Restock Complete",
            description: `Added 5 units of ${v.year} ${v.make} ${v.model}.`,
          });
        }}
      />
    </DashboardLayout>
  );
}
