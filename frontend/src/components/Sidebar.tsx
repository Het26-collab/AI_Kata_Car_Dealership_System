import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { to: "/inventory", label: "Inventory", icon: "directions_car" },
  { to: "/analytics", label: "Analytics", icon: "bar_chart" },
  { to: "/pipeline", label: "Pipeline", icon: "view_kanban" },
  { to: "/settings", label: "Settings", icon: "settings" },
];

interface SidebarProps {
  onAddVehicle?: () => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ onAddVehicle, isOpen, onCloseMobile }: SidebarProps) {
  const { logout, user } = useAuth();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[280px] flex-col border-r border-outline-variant bg-surface-container-lowest p-md transition-transform duration-200 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-md px-sm py-md border-b border-outline-variant/50 pb-md mb-xs">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-white shadow-md ring-1 ring-white/20">
            <span className="material-symbols-outlined text-[22px]">directions_car</span>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 ring-2 ring-white"></span>
            </span>
          </div>
          <div className="overflow-hidden">
            <div className="flex items-center gap-xs">
              <h2 className="text-title-md font-extrabold tracking-tight text-on-surface truncate">Global Motors</h2>
              <span className="rounded bg-primary/10 px-xs py-[2px] text-[10px] font-bold text-primary uppercase tracking-wide">PRO</span>
            </div>
            <p className="text-label-sm font-medium text-on-surface-variant truncate">AutoFleet Pro &bull; Enterprise</p>
          </div>
        </div>

        <nav className="mt-lg flex flex-1 flex-col gap-xs overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-md rounded-lg p-md text-label-md transition-all duration-200 ${
                  isActive
                    ? "bg-secondary-container font-semibold text-on-secondary-container"
                    : "text-on-secondary-container/70 hover:bg-surface-container-high"
                }`
              }
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-md flex flex-col gap-sm">
          {onAddVehicle && (
            <button
              type="button"
              onClick={onAddVehicle}
              className="flex w-full items-center justify-center gap-sm rounded-lg bg-primary px-lg py-md text-label-md font-semibold text-on-primary transition-all hover:opacity-90 active:scale-[0.98]"
            >
              <span className="material-symbols-outlined">add</span>
              Add Vehicle
            </button>
          )}

          <div className="mt-sm flex flex-col gap-xs border-t border-outline-variant pt-sm">
            <NavLink
              to="/support"
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-md rounded-lg p-md text-label-md transition-all duration-200 ${
                  isActive
                    ? "bg-secondary-container font-semibold text-on-secondary-container"
                    : "text-on-secondary-container/70 hover:bg-surface-container-high"
                }`
              }
            >
              <span className="material-symbols-outlined">support_agent</span>
              Support
            </NavLink>
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-md rounded-lg p-md text-left text-label-md text-error transition-all hover:bg-error-container/40"
            >
              <span className="material-symbols-outlined">logout</span>
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
