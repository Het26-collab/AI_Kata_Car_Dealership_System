import type { ReactNode } from "react";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="flex items-center justify-center px-lg py-3xl sm:px-2xl">
        <div className="w-full max-w-sm">{children}</div>
      </div>

      <div className="relative hidden overflow-hidden bg-primary lg:block">
        <div
          className="absolute inset-0 bg-gradient-to-br from-primary via-[#1e40af] to-[#0f172a] opacity-95"
          aria-hidden="true"
        />
        <div className="relative flex h-full flex-col justify-between p-2xl text-on-primary">
          <div className="flex justify-end">
            <span className="flex items-center gap-sm rounded-full bg-white/10 px-md py-sm text-label-md backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-success" />
              System Status: Operational
            </span>
          </div>

          <div className="max-w-md rounded-xl bg-white/10 p-lg backdrop-blur-md">
            <span className="inline-block rounded-full bg-white/15 px-md py-xs text-label-sm uppercase tracking-wide">
              Enterprise
            </span>
            <p className="mt-md text-title-lg font-semibold">Precision fleet management for global logistics.</p>
            <p className="mt-sm text-body-md text-on-primary/80">
              Integrated real-time analytics, automated inventory forecasting, and comprehensive logistics
              oversight in a unified environment.
            </p>
            <div className="mt-lg flex gap-lg border-t border-white/20 pt-lg">
              <div>
                <p className="text-label-sm uppercase tracking-wide text-on-primary/70">Daily Uptime</p>
                <p className="text-headline-md font-semibold">99.99%</p>
              </div>
              <div>
                <p className="text-label-sm uppercase tracking-wide text-on-primary/70">Ops Efficiency</p>
                <p className="text-headline-md font-semibold">+32%</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between text-label-md text-on-primary/70">
            <p>&copy; {new Date().getFullYear()} AutoFleet Pro Enterprise. All rights reserved.</p>
            <div className="flex gap-md">
              <a href="#" className="hover:text-on-primary">
                Security
              </a>
              <a href="#" className="hover:text-on-primary">
                Privacy
              </a>
              <a href="#" className="hover:text-on-primary">
                Terms
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
