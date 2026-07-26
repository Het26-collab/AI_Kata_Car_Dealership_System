import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { staggerContainer, staggerItem } from "../lib/motion";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon = "directions_car", title, description, action }: EmptyStateProps) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      className="flex flex-col items-center justify-center rounded-lg border border-outline-variant bg-surface-container-lowest px-lg py-3xl text-center"
      variants={!prefersReduced ? staggerContainer : undefined}
      initial={!prefersReduced ? "hidden" : undefined}
      animate={!prefersReduced ? "visible" : undefined}
    >
      <motion.span
        className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-container text-on-surface-variant"
        variants={!prefersReduced ? staggerItem : undefined}
      >
        <span className="material-symbols-outlined text-[32px]">{icon}</span>
      </motion.span>
      <motion.h3
        className="mt-lg text-title-lg text-on-surface"
        variants={!prefersReduced ? staggerItem : undefined}
      >
        {title}
      </motion.h3>
      <motion.p
        className="mt-sm max-w-sm text-body-md text-on-surface-variant"
        variants={!prefersReduced ? staggerItem : undefined}
      >
        {description}
      </motion.p>
      {action && (
        <motion.div
          className="mt-lg flex items-center gap-sm"
          variants={!prefersReduced ? staggerItem : undefined}
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  );
}
