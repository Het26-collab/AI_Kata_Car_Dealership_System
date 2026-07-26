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
  const { logout } = useAuth();

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
        <div className="flex items-center justify-center px-xs py-md border-b border-outline-variant/50 pb-md mb-xs overflow-hidden">
          <img src="/Logo_GM.png" alt="Global Motors Logo" className="h-32 w-auto max-w-[260px] object-contain scale-[1.75] transform transition-transform" />
        </div>

        <nav className="mt-lg flex flex-1 flex-col gap-xs overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-md rounded-xl px-md py-md text-label-lg transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-on-primary font-bold shadow-md shadow-primary/20"
                    : "text-slate-700 dark:text-slate-200 font-semibold hover:bg-surface-container-high hover:text-primary"
                }`
              }
            >
              <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
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
                `flex items-center gap-md rounded-xl px-md py-md text-label-lg transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-on-primary font-bold shadow-md shadow-primary/20"
                    : "text-slate-700 dark:text-slate-200 font-semibold hover:bg-surface-container-high hover:text-primary"
                }`
              }
            >
              <span className="material-symbols-outlined text-[22px]">support_agent</span>
              Support
            </NavLink>
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-md rounded-xl px-md py-md text-left text-label-lg font-semibold text-error transition-all hover:bg-error-container/40"
            >
              <span className="material-symbols-outlined text-[22px]">logout</span>
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
