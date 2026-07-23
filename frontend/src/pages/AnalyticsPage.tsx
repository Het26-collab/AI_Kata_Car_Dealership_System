import { useState } from "react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { KpiCard } from "../components/KpiCard";
import { InventoryMixChart } from "../components/InventoryMixChart";
import { Skeleton } from "../components/Skeleton";
import { Button } from "../components/Button";
import { StatusBadge } from "../components/StatusBadge";
import { useFleetStats } from "../hooks/useFleetStats";
import { useVehicles } from "../hooks/useVehicles";
import { formatNumber, formatCurrency, maskVin } from "../utils/format";
import { exportVehiclesToCsv } from "../utils/export";
import { useToast } from "../hooks/useToast";

const TIMEFRAMES = ["All Time", "Q3 2026", "YTD 2026", "Last 30 Days"];

export function AnalyticsPage() {
  const { stats, isLoading: statsLoading } = useFleetStats();
  const { vehicles, isLoading: vehiclesLoading } = useVehicles({ sort: "newest" });
  const { showToast } = useToast();
  const [selectedTimeframe, setSelectedTimeframe] = useState("All Time");

  const isLoading = statsLoading || vehiclesLoading;

  // Compute analytics metrics from vehicles dataset
  const totalValue = vehicles.reduce((sum, v) => sum + v.price * v.quantity, 0);
  const totalUnits = vehicles.reduce((sum, v) => sum + v.quantity, 0);
  const avgPrice = vehicles.length ? Math.round(totalValue / totalUnits) : 0;
  const inTransitCount = vehicles.filter((v) => v.status === "In Transit").length;
  const reservedCount = vehicles.filter((v) => v.status === "Reserved").length;

  // Price Bracket Analysis
  const priceBrackets = [
    { label: "Under $35,000", count: vehicles.filter((v) => v.price < 35000).length },
    { label: "$35,000 - $60,000", count: vehicles.filter((v) => v.price >= 35000 && v.price <= 60000).length },
    { label: "$60,000 - $100,000", count: vehicles.filter((v) => v.price > 60000 && v.price <= 100000).length },
    { label: "Over $100,000", count: vehicles.filter((v) => v.price > 100000).length },
  ];

  // Fuel Type Breakdown
  const fuelBreakdown = [
    { type: "Gasoline", count: vehicles.filter((v) => v.fuelType === "Gasoline").length, color: "bg-blue-500" },
    { type: "Hybrid", count: vehicles.filter((v) => v.fuelType === "Hybrid").length, color: "bg-emerald-500" },
    { type: "Electric", count: vehicles.filter((v) => v.fuelType === "Electric").length, color: "bg-purple-500" },
  ];

  // Top 5 Highest Valuation Flagship Vehicles
  const topVehicles = [...vehicles].sort((a, b) => b.price - a.price).slice(0, 5);

  function handleExportAnalytics() {
    exportVehiclesToCsv(vehicles, `analytics-fleet-report-${selectedTimeframe.toLowerCase().replace(/\s+/g, "-")}.csv`);
    showToast({
      variant: "success",
      title: "Analytics Report Exported",
      description: `Downloaded comprehensive analytics CSV for ${selectedTimeframe}.`,
    });
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-md sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-headline-md text-on-surface">Fleet Analytics & Intelligence</h1>
          <p className="text-body-md text-on-surface-variant">
            Comprehensive business intelligence, valuation distribution, and inventory forecasting.
          </p>
        </div>

        <div className="flex items-center gap-sm">
          <div className="flex items-center gap-xs rounded-lg border border-outline-variant bg-surface-container-lowest p-xs">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setSelectedTimeframe(tf)}
                className={`rounded-md px-sm py-xs text-label-sm font-medium transition-all ${
                  selectedTimeframe === tf
                    ? "bg-primary text-on-primary shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
          <Button size="sm" variant="secondary" onClick={handleExportAnalytics}>
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export Analytics
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-lg">
          <div className="grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-80" />
        </div>
      ) : (
        <>
          {/* ── 6 Executive KPI Cards ───────────────────────────────────── */}
          <div className="grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-3">
            <KpiCard
              icon="account_balance_wallet"
              label="Total Fleet Valuation"
              value={formatCurrency(totalValue || stats?.totalValue || 0)}
              tone="primary"
              trailing={<span className="text-label-md text-emerald-600 font-semibold">+12.4% vs last month</span>}
            />
            <KpiCard
              icon="sell"
              label="Average Vehicle Price"
              value={formatCurrency(avgPrice)}
              tone="primary"
              trailing={<span className="text-label-md text-on-surface-variant">{vehicles.length} models tracked</span>}
            />
            <KpiCard
              icon="swap_arrows"
              label="Turnover Efficiency"
              value="24.8%"
              tone="success"
              trailing={<span className="text-label-md text-on-surface-variant">Est. 36 days to sell</span>}
            />
            <KpiCard
              icon="inventory_2"
              label="Total Inventory Units"
              value={formatNumber(totalUnits || stats?.totalVehicles || 0)}
              tone="primary"
              trailing={<span className="text-label-md text-on-surface-variant">{stats?.available ?? 0} available</span>}
            />
            <KpiCard
              icon="local_shipping"
              label="Pipeline Units"
              value={formatNumber(inTransitCount + reservedCount)}
              tone="warning"
              trailing={
                <span className="text-label-md text-on-surface-variant">
                  {reservedCount} Reserved &bull; {inTransitCount} In Transit
                </span>
              }
            />
            <KpiCard
              icon="report_problem"
              label="Low Stock Risk"
              value={formatNumber(stats?.lowStock ?? 0)}
              tone="danger"
              trailing={<span className="text-label-md text-error font-semibold">Requires restock</span>}
            />
          </div>

          {/* ── Visual Analytics Breakdown ─────────────────────────────── */}
          <div className="grid grid-cols-1 gap-lg lg:grid-cols-3">
            {/* Category Mix Chart */}
            <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-lg shadow-card lg:col-span-2">
              <div className="flex items-center justify-between mb-md">
                <div>
                  <h3 className="text-title-lg font-bold text-on-surface">Category Distribution & Volume</h3>
                  <p className="text-body-md text-on-surface-variant">Share of inventory units by vehicle class</p>
                </div>
                <span className="text-label-md font-semibold text-primary">
                  {stats?.totalModels ?? 0} Active Categories
                </span>
              </div>
              {stats && <InventoryMixChart data={stats.inventoryMix} />}
            </div>

            {/* Powertrain / Fuel Breakdown */}
            <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-lg shadow-card">
              <h3 className="text-title-lg font-bold text-on-surface mb-xs">Powertrain Breakdown</h3>
              <p className="text-body-md text-on-surface-variant mb-lg">Electric vs Hybrid vs ICE units</p>

              <div className="space-y-md">
                {fuelBreakdown.map((item) => {
                  const pct = vehicles.length ? Math.round((item.count / vehicles.length) * 100) : 0;
                  return (
                    <div key={item.type} className="space-y-xs">
                      <div className="flex justify-between text-body-md font-medium text-on-surface">
                        <div className="flex items-center gap-xs">
                          <span className={`h-3 w-3 rounded-full ${item.color}`} />
                          <span>{item.type}</span>
                        </div>
                        <span>
                          {item.count} models ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-high">
                        <div className={`h-full ${item.color}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price Tier Quadrants */}
              <div className="mt-xl pt-md border-t border-outline-variant">
                <h4 className="text-title-md font-bold text-on-surface mb-md">Price Segment Quadrants</h4>
                <div className="grid grid-cols-2 gap-sm">
                  {priceBrackets.map((pb) => (
                    <div key={pb.label} className="rounded-md border border-outline-variant/60 bg-surface-container-low p-sm">
                      <p className="text-label-sm text-on-surface-variant">{pb.label}</p>
                      <p className="text-title-md font-bold text-on-surface mt-xs">{pb.count} models</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Top 5 Flagship Vehicles Table ───────────────────────────── */}
          <div className="rounded-lg border border-outline-variant bg-surface-container-lowest shadow-card">
            <div className="flex items-center justify-between px-lg py-md border-b border-outline-variant">
              <div>
                <h3 className="text-title-lg font-bold text-on-surface">Top Flagship Assets</h3>
                <p className="text-body-md text-on-surface-variant">Highest valuation vehicles in enterprise inventory</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low text-label-sm uppercase tracking-wider text-on-surface-variant">
                  <tr>
                    <th className="px-lg py-md">Vehicle</th>
                    <th className="px-lg py-md">VIN</th>
                    <th className="px-lg py-md">Category</th>
                    <th className="px-lg py-md">Quantity</th>
                    <th className="px-lg py-md">Price per Unit</th>
                    <th className="px-lg py-md">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/40 text-body-md">
                  {topVehicles.map((v) => (
                    <tr key={v.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-lg py-md font-medium text-on-surface">
                        {v.year} {v.make} {v.model} <span className="text-on-surface-variant font-normal">({v.trim})</span>
                      </td>
                      <td className="px-lg py-md font-mono text-on-surface-variant">{maskVin(v.vin)}</td>
                      <td className="px-lg py-md text-on-surface-variant">{v.category}</td>
                      <td className="px-lg py-md font-semibold text-on-surface">{v.quantity} units</td>
                      <td className="px-lg py-md font-semibold text-primary">{formatCurrency(v.price)}</td>
                      <td className="px-lg py-md">
                        <StatusBadge status={v.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
