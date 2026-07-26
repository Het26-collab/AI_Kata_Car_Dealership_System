import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useAuth } from "../hooks/useAuth";
import { staggerContainer, staggerItem, backdropVariants } from "../lib/motion";

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
  const location = useLocation();
  const prefersReduced = useReducedMotion();

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-30 bg-black/40 md:hidden"
            onClick={onCloseMobile}
            aria-hidden="true"
            variants={!prefersReduced ? backdropVariants : undefined}
            initial={!prefersReduced ? "hidden" : undefined}
            animate={!prefersReduced ? "visible" : undefined}
            exit={!prefersReduced ? "exit" : undefined}
          />
        )}
      </AnimatePresence>
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[280px] flex-col border-r border-outline-variant bg-surface-container-lowest p-md transition-transform duration-200 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-center px-xs py-md border-b border-outline-variant/50 pb-md mb-xs overflow-hidden">
          <img src="/Logo_GM.png" alt="Global Motors Logo" className="h-32 w-auto max-w-[260px] object-contain scale-[1.75] transform transition-transform" />
        </div>

        <motion.nav
          className="mt-lg flex flex-1 flex-col gap-xs overflow-y-auto"
          variants={!prefersReduced ? staggerContainer : undefined}
          initial={!prefersReduced ? "hidden" : undefined}
          animate={!prefersReduced ? "visible" : undefined}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <motion.div
                key={item.to}
                variants={!prefersReduced ? staggerItem : undefined}
                className="relative"
              >
                {/* Animated active indicator — Linear-style smooth transition */}
                {isActive && (
                  <motion.div
                    layoutId={!prefersReduced ? "sidebar-active" : undefined}
                    className="absolute inset-0 rounded-xl bg-primary shadow-md shadow-primary/20"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <NavLink
                  to={item.to}
                  onClick={onCloseMobile}
                  className={`group relative z-10 flex items-center gap-md rounded-xl px-md py-md text-label-lg transition-colors duration-200 ${
                    isActive
                      ? "text-on-primary font-bold"
                      : "text-slate-700 dark:text-slate-200 font-semibold hover:bg-surface-container-high hover:text-primary hover:shadow-sm"
                  }`}
                >
                  <motion.span
                    className="material-symbols-outlined text-[22px]"
                    whileHover={!prefersReduced && !isActive ? { x: 3 } : undefined}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {item.icon}
                  </motion.span>
                  <span className="transition-all duration-200">{item.label}</span>
                </NavLink>
              </motion.div>
            );
          })}
        </motion.nav>

        <div className="mt-md flex flex-col gap-sm">
          {onAddVehicle && (
            <motion.button
              type="button"
              onClick={onAddVehicle}
              className="flex w-full items-center justify-center gap-sm rounded-lg bg-primary px-lg py-md text-label-md font-semibold text-on-primary transition-all hover:opacity-90"
              whileTap={!prefersReduced ? { scale: 0.97 } : undefined}
              whileHover={!prefersReduced ? { y: -1 } : undefined}
            >
              <motion.span
                className="material-symbols-outlined"
                whileHover={!prefersReduced ? { rotate: 90 } : undefined}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                add
              </motion.span>
              Add Vehicle
            </motion.button>
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
