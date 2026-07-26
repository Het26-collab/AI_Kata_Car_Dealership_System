import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { fadeInUp, staggerContainer, staggerItem } from "../lib/motion";

export function AuthLayout({ children }: { children: ReactNode }) {
  const prefersReduced = useReducedMotion();

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2 bg-background">
      {/* Left Form Section */}
      <div className="flex items-center justify-center px-lg py-2xl sm:px-2xl">
        <motion.div
          className="w-full max-w-sm"
          variants={!prefersReduced ? fadeInUp : undefined}
          initial={!prefersReduced ? "hidden" : undefined}
          animate={!prefersReduced ? "visible" : undefined}
        >
          {children}
        </motion.div>
      </div>

      {/* Right Decorative Hero Panel */}
      <div className="relative hidden overflow-hidden bg-primary lg:block">
        <div
          className="absolute inset-0 bg-gradient-to-br from-primary via-[#1e40af] to-[#0f172a] opacity-95"
          aria-hidden="true"
        />

        {/* Ambient Motion Orbs */}
        <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />

        <motion.div
          className="relative flex h-full flex-col justify-between p-2xl text-on-primary"
          variants={!prefersReduced ? staggerContainer : undefined}
          initial={!prefersReduced ? "hidden" : undefined}
          animate={!prefersReduced ? "visible" : undefined}
        >
          {/* Top Operational Badge */}
          <motion.div className="flex justify-end" variants={!prefersReduced ? staggerItem : undefined}>
            <span className="flex items-center gap-sm rounded-full bg-white/10 px-md py-sm text-label-md backdrop-blur-md border border-white/10 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              System Status: Operational
            </span>
          </motion.div>

          {/* Center Showcase Card */}
          <motion.div
            className="max-w-md rounded-2xl bg-white/10 p-2xl backdrop-blur-md border border-white/15 shadow-2xl"
            variants={!prefersReduced ? staggerItem : undefined}
          >
            <span className="inline-block rounded-full bg-white/15 px-md py-xs text-label-sm uppercase tracking-wider font-semibold text-white">
              Enterprise Grade
            </span>
            <h3 className="mt-md text-headline-sm font-bold leading-tight">
              Precision fleet management for global dealership operations.
            </h3>
            <p className="mt-sm text-body-md text-on-primary/80 leading-relaxed">
              Integrated real-time valuation metrics, dynamic inventory forecasting, and end-to-end loan quote calculation in a unified platform.
            </p>
            <div className="mt-xl flex gap-xl border-t border-white/20 pt-lg">
              <div>
                <p className="text-label-sm uppercase tracking-wide text-on-primary/70">Daily Uptime</p>
                <p className="text-headline-md font-bold">99.99%</p>
              </div>
              <div>
                <p className="text-label-sm uppercase tracking-wide text-on-primary/70">Fleet Valuation</p>
                <p className="text-headline-md font-bold">$1.8M+</p>
              </div>
              <div>
                <p className="text-label-sm uppercase tracking-wide text-on-primary/70">Active Units</p>
                <p className="text-headline-md font-bold">120+</p>
              </div>
            </div>
          </motion.div>

          {/* Footer Rights */}
          <motion.div
            className="flex justify-between text-label-md text-on-primary/70"
            variants={!prefersReduced ? staggerItem : undefined}
          >
            <p>&copy; {new Date().getFullYear()} Global Motors DriveFlow. All rights reserved.</p>
            <div className="flex gap-md font-medium">
              <a href="#" className="hover:text-on-primary transition-colors">
                Security Policy
              </a>
              <a href="#" className="hover:text-on-primary transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-on-primary transition-colors">
                Compliance
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
