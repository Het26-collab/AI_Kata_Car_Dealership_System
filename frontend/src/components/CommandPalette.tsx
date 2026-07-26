import { useEffect, useState, useMemo } from "react";
import { Command } from "cmdk";
import { useNavigate } from "react-router-dom";
import { useVehicles } from "../hooks/useVehicles";
import { useAuth } from "../hooks/useAuth";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { vehicles } = useVehicles({ sort: "newest" });
  const navigate = useNavigate();

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Compute unique categories and makes for quick actions
  const uniqueCategories = useMemo(() => Array.from(new Set(vehicles.map((v) => v.category))), [vehicles]);
  const topVehicles = useMemo(() => [...vehicles].sort((a, b) => b.price - a.price).slice(0, 5), [vehicles]);

  function handleSelect(action: () => void) {
    action();
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-scrim/60 backdrop-blur-sm p-4 pt-[15vh]">
      <Command
        className="w-full max-w-2xl overflow-hidden rounded-xl border border-outline-variant bg-surface shadow-2xl ring-1 ring-black/5"
        shouldFilter={true}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            setOpen(false);
          }
        }}
      >
        <div className="flex items-center border-b border-outline-variant px-lg py-md text-on-surface">
          <span className="material-symbols-outlined mr-sm text-[22px] text-on-surface-variant">search</span>
          <Command.Input
            autoFocus
            placeholder="Search inventory, categories, or settings..."
            className="flex-1 bg-transparent text-body-lg outline-none placeholder:text-on-surface-variant/70"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-outline-variant bg-surface-container px-2 py-0.5 text-[11px] font-mono font-medium text-on-surface-variant">
            ESC
          </kbd>
        </div>

        <Command.List className="max-h-[400px] overflow-y-auto p-sm scrollbar-thin">
          <Command.Empty className="py-xl text-center text-body-md text-on-surface-variant">
            No results found.
          </Command.Empty>

          <Command.Group heading={<span className="px-sm text-label-sm font-semibold text-primary">Quick Navigation</span>}>
            <Command.Item
              onSelect={() => handleSelect(() => navigate("/dashboard"))}
              className="flex cursor-pointer items-center gap-sm rounded-lg px-md py-sm text-body-md text-on-surface transition-colors aria-selected:bg-surface-container-low aria-selected:text-primary"
            >
              <span className="material-symbols-outlined text-[18px]">dashboard</span>
              Dashboard Overview
            </Command.Item>
            <Command.Item
              onSelect={() => handleSelect(() => navigate("/inventory"))}
              className="flex cursor-pointer items-center gap-sm rounded-lg px-md py-sm text-body-md text-on-surface transition-colors aria-selected:bg-surface-container-low aria-selected:text-primary"
            >
              <span className="material-symbols-outlined text-[18px]">directions_car</span>
              Manage Inventory
            </Command.Item>
            <Command.Item
              onSelect={() => handleSelect(() => navigate("/analytics"))}
              className="flex cursor-pointer items-center gap-sm rounded-lg px-md py-sm text-body-md text-on-surface transition-colors aria-selected:bg-surface-container-low aria-selected:text-primary"
            >
              <span className="material-symbols-outlined text-[18px]">bar_chart</span>
              Fleet Analytics
            </Command.Item>
            <Command.Item
              onSelect={() => handleSelect(() => navigate("/pipeline"))}
              className="flex cursor-pointer items-center gap-sm rounded-lg px-md py-sm text-body-md text-on-surface transition-colors aria-selected:bg-surface-container-low aria-selected:text-primary"
            >
              <span className="material-symbols-outlined text-[18px]">view_kanban</span>
              Inventory Pipeline
            </Command.Item>
          </Command.Group>

          <Command.Group heading={<span className="px-sm text-label-sm font-semibold text-primary mt-sm block">Top Flagship Assets</span>}>
            {topVehicles.map((vehicle) => (
              <Command.Item
                key={vehicle.id}
                onSelect={() => handleSelect(() => navigate("/inventory"))}
                className="flex cursor-pointer items-center gap-md rounded-lg px-md py-sm transition-colors aria-selected:bg-surface-container-low"
              >
                <img src={vehicle.image} alt={vehicle.model} className="h-8 w-12 rounded object-cover shadow-sm border border-outline-variant/50" />
                <div className="flex flex-col">
                  <span className="text-body-md font-medium text-on-surface">{vehicle.year} {vehicle.make} {vehicle.model}</span>
                  <span className="text-label-sm text-on-surface-variant">{vehicle.vin} &bull; ${vehicle.price.toLocaleString()}</span>
                </div>
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Group heading={<span className="px-sm text-label-sm font-semibold text-primary mt-sm block">Filter by Category</span>}>
            {uniqueCategories.map((category) => (
              <Command.Item
                key={category}
                onSelect={() => handleSelect(() => navigate("/inventory"))}
                className="flex cursor-pointer items-center gap-sm rounded-lg px-md py-sm text-body-md text-on-surface transition-colors aria-selected:bg-surface-container-low"
              >
                <span className="material-symbols-outlined text-[18px]">category</span>
                Show all {category}s
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>
      </Command>

      {/* Global CSS for CMDK animations and active states */}
      <style>{`
        [cmdk-item][aria-selected="true"] {
          background-color: var(--color-surface-container-low, #f0f4f8);
        }
      `}</style>
    </div>
  );
}
