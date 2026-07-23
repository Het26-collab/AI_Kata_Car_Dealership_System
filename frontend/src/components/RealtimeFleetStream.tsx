import { useState, useEffect } from "react";
import type { Vehicle } from "../types/vehicle";
import { formatCurrency } from "../utils/format";

interface FleetEvent {
  id: string;
  timestamp: string;
  type: "purchase" | "restock" | "price_update" | "new_arrival";
  title: string;
  description: string;
  badgeTone: "success" | "primary" | "warning" | "info";
}

interface RealtimeFleetStreamProps {
  vehicles: Vehicle[];
}

export function RealtimeFleetStream({ vehicles }: RealtimeFleetStreamProps) {
  const [events, setEvents] = useState<FleetEvent[]>([]);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!vehicles || vehicles.length === 0) return;

    // Generate initial live fleet audit events
    const sampleVehicles = vehicles.slice(0, 5);
    const initialEvents: FleetEvent[] = sampleVehicles.map((v, i) => {
      const times = ["2 mins ago", "14 mins ago", "35 mins ago", "1 hr ago", "3 hrs ago"];
      const types: Array<FleetEvent["type"]> = ["purchase", "restock", "new_arrival", "price_update", "purchase"];
      const tones: Array<FleetEvent["badgeTone"]> = ["success", "primary", "info", "warning", "success"];
      const type = types[i % types.length];

      return {
        id: `event-${i}`,
        timestamp: times[i],
        type,
        badgeTone: tones[i],
        title:
          type === "purchase"
            ? `${v.year} ${v.make} ${v.model} Purchased`
            : type === "restock"
            ? `Restock Order Received (+5 units)`
            : type === "new_arrival"
            ? `New Fleet Unit Listed (${v.make})`
            : `Valuation Update Registered`,
        description: `VIN ${v.vin.slice(0, 8)}... • Valued at ${formatCurrency(v.price)}`,
      };
    });

    setEvents(initialEvents);

    // Simulate real-time WebSocket ticker updates every 12 seconds if live
    const interval = setInterval(() => {
      if (!isLive) return;
      const randomVehicle = vehicles[Math.floor(Math.random() * vehicles.length)];
      if (!randomVehicle) return;

      const newEvent: FleetEvent = {
        id: `live-${Date.now()}`,
        timestamp: "Just now",
        type: "purchase",
        badgeTone: "success",
        title: `${randomVehicle.year} ${randomVehicle.make} ${randomVehicle.model} Reserved`,
        description: `Real-time activity sync from Dealership Hub • ${formatCurrency(randomVehicle.price)}`,
      };

      setEvents((prev) => [newEvent, ...prev.slice(0, 5)]);
    }, 12000);

    return () => clearInterval(interval);
  }, [vehicles, isLive]);

  return (
    <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-lg shadow-card">
      <div className="flex items-center justify-between mb-md">
        <div className="flex items-center gap-xs">
          <span className="relative flex h-3 w-3">
            {isLive && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
            <span className={`relative inline-flex rounded-full h-3 w-3 ${isLive ? "bg-emerald-500" : "bg-gray-400"}`}></span>
          </span>
          <h3 className="text-title-lg font-bold text-on-surface">Live Fleet Activity Ticker</h3>
        </div>
        <button
          type="button"
          onClick={() => setIsLive((prev) => !prev)}
          className="text-label-sm font-semibold text-primary hover:underline"
        >
          {isLive ? "Pause Live Feed" : "Resume Live Feed"}
        </button>
      </div>

      <div className="space-y-sm">
        {events.map((evt) => (
          <div
            key={evt.id}
            className="flex items-start justify-between gap-md rounded-lg border border-outline-variant/50 p-sm transition-all hover:bg-surface-container-low"
          >
            <div className="flex items-start gap-md">
              <div className="mt-xs flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-high text-primary">
                <span className="material-symbols-outlined text-[18px]">
                  {evt.type === "purchase"
                    ? "shopping_bag"
                    : evt.type === "restock"
                    ? "add_business"
                    : evt.type === "new_arrival"
                    ? "auto_awesome"
                    : "update"}
                </span>
              </div>
              <div>
                <p className="text-body-md font-semibold text-on-surface">{evt.title}</p>
                <p className="text-label-sm text-on-surface-variant">{evt.description}</p>
              </div>
            </div>
            <span className="text-label-sm font-medium text-on-surface-variant shrink-0">{evt.timestamp}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
