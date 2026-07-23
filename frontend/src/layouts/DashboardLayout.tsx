import { useState, type ReactNode } from "react";
import { Sidebar } from "../components/Sidebar";
import { Topbar } from "../components/Topbar";
import { ToastContainer } from "../components/ToastContainer";

interface DashboardLayoutProps {
  children: ReactNode;
  onSearch?: (value: string) => void;
  onAddVehicle?: () => void;
}

export function DashboardLayout({ children, onSearch, onAddVehicle }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={isSidebarOpen} onCloseMobile={() => setIsSidebarOpen(false)} onAddVehicle={onAddVehicle} />
      <Topbar onSearch={onSearch} onMenuClick={() => setIsSidebarOpen(true)} />
      <main className="min-h-screen pt-16 md:pl-[280px]">
        <div className="mx-auto max-w-7xl space-y-lg p-gutter">{children}</div>
      </main>
      <footer className="md:pl-[280px]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-sm px-gutter py-lg text-label-md text-on-surface-variant sm:flex-row">
          <p>
            <span className="font-semibold text-primary">AutoFleet Pro</span> / DriveFlow &copy;{" "}
            {new Date().getFullYear()} Enterprise Edition
          </p>
          <div className="flex gap-md">
            <a href="#" className="hover:text-on-surface">
              Privacy
            </a>
            <a href="#" className="hover:text-on-surface">
              Terms
            </a>
            <a href="#" className="hover:text-on-surface">
              Help Center
            </a>
          </div>
        </div>
      </footer>
      <ToastContainer />
    </div>
  );
}
