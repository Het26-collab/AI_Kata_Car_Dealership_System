import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { fadeInUp, staggerContainer, staggerItem } from "../lib/motion";

export function LandingPage() {
  const prefersReduced = useReducedMotion();

  return (
    <div className="min-h-screen bg-background text-on-background selection:bg-primary-container selection:text-on-primary-container">
      {/* Top Header App Bar */}
      <header className="fixed top-0 z-50 w-full border-b border-outline-variant/30 bg-surface/70 backdrop-blur-xl transition-all duration-250">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-md md:h-20 md:px-xl">
          <Link to="/" className="flex items-center gap-sm transition-opacity hover:opacity-90">
            <span
              className="material-symbols-outlined text-[28px] font-bold text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              speed
            </span>
            <span className="text-title-lg font-bold tracking-tight text-primary md:text-headline-sm">
              DriveFlow
            </span>
          </Link>

          <div className="flex items-center gap-sm">
            <Link
              to="/login"
              className="rounded-lg px-md py-sm text-label-md font-semibold text-on-surface hover:bg-surface-container-high transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-xs rounded-lg bg-primary px-lg py-sm text-label-md font-semibold text-on-primary shadow-sm hover:bg-primary-fixed-variant transition-colors"
            >
              Get Started
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-2xl pt-24 md:pt-32">
        {/* Hero Section */}
        <section className="mx-auto grid min-h-[640px] max-w-7xl grid-cols-1 items-center gap-xl px-md lg:grid-cols-2 md:px-xl">
          <motion.div
            className="z-10 flex flex-col gap-lg"
            variants={!prefersReduced ? staggerContainer : undefined}
            initial={!prefersReduced ? "hidden" : undefined}
            animate={!prefersReduced ? "visible" : undefined}
          >
            <motion.div
              variants={!prefersReduced ? staggerItem : undefined}
              className="inline-flex w-fit items-center gap-xs rounded-full border border-outline-variant bg-surface-container-high px-sm py-xs"
            >
              <span className="material-symbols-outlined text-[14px] text-primary">verified</span>
              <span className="text-label-sm text-on-surface-variant font-medium">
                Enterprise Grade Fleet Management v2.0
              </span>
            </motion.div>

            <motion.h1
              variants={!prefersReduced ? staggerItem : undefined}
              className="max-w-[620px] text-headline-lg-mobile font-bold leading-tight text-on-background md:text-display-lg"
            >
              Manage, Value & Forecast Enterprise Fleet Inventory in Real Time.
            </motion.h1>

            <motion.p
              variants={!prefersReduced ? staggerItem : undefined}
              className="max-w-[520px] text-body-lg text-on-surface-variant"
            >
              Comprehensive dealership monitoring for inventory, logistics, financing, and AI forecasting.
              Built for scale, engineered for precision.
            </motion.p>

            <motion.div
              variants={!prefersReduced ? staggerItem : undefined}
              className="flex flex-col gap-md pt-sm sm:flex-row"
            >
              <Link
                to="/login"
                className="flex items-center justify-center gap-xs rounded-lg bg-primary px-xl py-md text-label-md font-semibold text-on-primary shadow-md hover:bg-primary-fixed-variant transition-all hover:-translate-y-0.5"
              >
                Explore Live Fleet
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
              <Link
                to="/register"
                className="flex items-center justify-center gap-xs rounded-lg border border-outline-variant bg-surface-container-lowest px-xl py-md text-label-md font-semibold text-on-surface hover:bg-surface-container-low transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">person_add</span>
                Create Free Account
              </Link>
            </motion.div>

            <motion.div
              variants={!prefersReduced ? staggerItem : undefined}
              className="mt-md flex flex-wrap items-center gap-lg border-t border-outline-variant/50 pt-md"
            >
              <div className="flex items-center gap-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px] text-primary">shield</span>
                <span className="text-label-sm font-medium">Enterprise Ready</span>
              </div>
              <div className="flex items-center gap-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px] text-primary">assignment_turned_in</span>
                <span className="text-label-sm font-medium">ISO Compliant</span>
              </div>
              <div className="flex items-center gap-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px] text-primary">memory</span>
                <span className="text-label-sm font-medium">AI Powered</span>
              </div>
              <div className="flex items-center gap-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px] text-primary">network_check</span>
                <span className="text-label-sm font-medium">99.99% Uptime</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Visuals Section */}
          <motion.div
            className="relative hidden h-[580px] w-full md:block"
            variants={!prefersReduced ? fadeInUp : undefined}
            initial={!prefersReduced ? "hidden" : undefined}
            animate={!prefersReduced ? "visible" : undefined}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-surface-container-low to-primary/10 blur-3xl opacity-60" />

            {/* Floating Glass Card 1: Tesla Model Y */}
            <div className="absolute left-[8%] top-[8%] z-20 w-[280px] rounded-2xl border border-outline-variant bg-surface-container-lowest/80 p-md backdrop-blur-xl shadow-xl hover:-translate-y-1 transition-transform cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=600&q=80"
                alt="Tesla Model Y"
                className="h-[140px] w-full rounded-xl object-cover"
              />
              <div className="mt-sm flex justify-between items-start">
                <div>
                  <h3 className="text-headline-sm font-bold text-on-surface">Tesla Model Y</h3>
                  <p className="flex items-center gap-0.5 text-body-md text-on-surface-variant">
                    <span className="material-symbols-outlined text-[14px]">location_on</span> San Jose, CA
                  </p>
                </div>
                <span className="rounded bg-emerald-500/10 px-sm py-0.5 text-label-sm font-semibold text-emerald-600 border border-emerald-500/20">
                  In Stock
                </span>
              </div>
              <p className="mt-xs text-headline-sm font-bold text-primary">$54,990</p>
            </div>

            {/* Floating Glass Card 2: BMW X5 */}
            <div className="absolute right-[5%] top-[38%] z-30 w-[260px] rounded-2xl border border-outline bg-surface-container-lowest/90 p-md backdrop-blur-xl shadow-2xl hover:-translate-y-1 transition-transform cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80"
                alt="BMW X5"
                className="h-[120px] w-full rounded-xl object-cover"
              />
              <div className="mt-sm flex justify-between items-start">
                <div>
                  <h3 className="text-title-md font-bold text-on-surface">BMW X5</h3>
                  <p className="flex items-center gap-0.5 text-label-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-[12px]">location_on</span> Austin, TX
                  </p>
                </div>
                <span className="rounded bg-amber-500/10 px-sm py-0.5 text-label-sm font-semibold text-amber-600 border border-amber-500/20">
                  Reserved
                </span>
              </div>
              <p className="mt-xs text-title-md font-bold text-on-surface">$65,200</p>
            </div>

            {/* Floating Glass Card 3: Ford F-150 */}
            <div className="absolute bottom-[8%] left-[22%] z-10 w-[290px] rounded-2xl border border-outline-variant bg-surface-container-lowest/80 p-md backdrop-blur-xl shadow-lg hover:-translate-y-1 transition-transform cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=600&q=80"
                alt="Ford F-150"
                className="h-[130px] w-full rounded-xl object-cover"
              />
              <div className="mt-sm flex justify-between items-start">
                <div>
                  <h3 className="text-headline-sm font-bold text-on-surface">Ford F-150</h3>
                  <p className="flex items-center gap-0.5 text-body-md text-on-surface-variant">
                    <span className="material-symbols-outlined text-[14px]">location_on</span> Denver, CO
                  </p>
                </div>
                <span className="rounded bg-emerald-500/10 px-sm py-0.5 text-label-sm font-semibold text-emerald-600 border border-emerald-500/20">
                  In Stock
                </span>
              </div>
              <p className="mt-xs text-headline-sm font-bold text-primary">$48,500</p>
            </div>
          </motion.div>
        </section>

        {/* KPI Metrics Section */}
        <section className="mx-auto max-w-7xl px-md py-xl md:px-xl">
          <div className="grid grid-cols-2 gap-md md:grid-cols-4">
            <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-lg shadow-sm hover:border-outline transition-all">
              <p className="text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
                Total Fleet Value
              </p>
              <p className="mt-xs text-display-sm font-bold tracking-tight text-on-surface">$1.2B+</p>
            </div>
            <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-lg shadow-sm hover:border-outline transition-all">
              <p className="text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
                Vehicles Managed
              </p>
              <p className="mt-xs text-display-sm font-bold tracking-tight text-on-surface">450k+</p>
            </div>
            <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-lg shadow-sm hover:border-outline transition-all">
              <p className="text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
                Monthly Transactions
              </p>
              <p className="mt-xs text-display-sm font-bold tracking-tight text-on-surface">12k+</p>
            </div>
            <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-lg shadow-sm hover:border-outline transition-all">
              <p className="text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
                Ops Efficiency
              </p>
              <p className="mt-xs text-display-sm font-bold tracking-tight text-primary">98.4%</p>
            </div>
          </div>
        </section>

        {/* Bento Grid Features */}
        <section className="mx-auto max-w-7xl px-md py-xl md:px-xl">
          <div className="mb-xl text-center">
            <h2 className="text-headline-md font-bold text-on-surface md:text-display-sm">
              Comprehensive Fleet Intelligence
            </h2>
            <p className="mt-xs text-body-lg text-on-surface-variant max-w-[600px] mx-auto">
              Consolidate your operations into a single, high-performance platform engineered for automotive enterprise scale.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-lg md:grid-cols-3">
            {/* Feature 1 */}
            <div className="relative overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest p-xl shadow-sm md:col-span-2">
              <span className="material-symbols-outlined text-[36px] text-primary mb-md block">
                insights
              </span>
              <h3 className="text-headline-sm font-bold text-on-surface mb-xs">
                Real-Time Fleet Intelligence
              </h3>
              <p className="text-body-md text-on-surface-variant mb-md max-w-[440px]">
                Instantly aggregate valuation, market forecasting, and dynamic pricing models across your entire national inventory footprint.
              </p>
              <ul className="space-y-xs text-label-md font-medium text-on-surface">
                <li className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span> Live Market Valuation
                </li>
                <li className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span> AI Depreciation Forecasting
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col justify-between rounded-2xl border border-outline-variant bg-surface-container-lowest p-xl shadow-sm">
              <div>
                <span className="material-symbols-outlined text-[36px] text-primary mb-md block">
                  request_quote
                </span>
                <h3 className="text-headline-sm font-bold text-on-surface mb-xs">
                  Loan & Lease Auto Desk
                </h3>
                <p className="text-body-md text-on-surface-variant">
                  Streamline finance desk operations with automated calculations, instant PDF generation, and integrated approval routing.
                </p>
              </div>
              <Link to="/login" className="mt-lg flex items-center gap-xs font-semibold text-primary hover:underline">
                Learn More <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="mx-auto max-w-4xl px-md py-2xl text-center md:px-xl">
          <h2 className="text-headline-md font-bold text-on-background md:text-display-sm">
            Ready to modernize your dealership operations?
          </h2>
          <p className="mt-xs text-body-lg text-on-surface-variant max-w-[600px] mx-auto">
            Join the leading automotive groups scaling their logistics and sales with DriveFlow's enterprise infrastructure.
          </p>
          <div className="mt-lg flex justify-center gap-md">
            <Link
              to="/register"
              className="flex items-center gap-xs rounded-lg bg-primary px-2xl py-md text-label-md font-semibold text-on-primary shadow-lg hover:bg-primary-fixed-variant transition-all hover:-translate-y-0.5"
            >
              Request Enterprise Demo
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-outline-variant/50 bg-surface-container-low py-xl">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-md px-md md:flex-row md:px-xl">
          <div className="text-title-lg font-bold text-on-surface">DriveFlow</div>
          <p className="text-body-md text-on-surface-variant">
            &copy; {new Date().getFullYear()} Global Motors DriveFlow. All rights reserved.
          </p>
          <div className="flex gap-md text-label-md font-medium text-on-surface-variant">
            <Link to="/login" className="hover:text-primary transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-primary transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
