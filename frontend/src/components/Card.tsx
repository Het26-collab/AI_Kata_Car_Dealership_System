import type { HTMLAttributes, ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cardHoverLift } from "../lib/motion";

interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart"> {
  children: ReactNode;
  hoverable?: boolean;
}

export function Card({ children, hoverable = false, className = "", ...rest }: CardProps) {
  const prefersReduced = useReducedMotion();

  if (hoverable && !prefersReduced) {
    return (
      <motion.div
        whileHover={cardHoverLift}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className={`rounded-lg border border-outline-variant bg-surface-container-lowest shadow-card transition-shadow duration-200 hover:shadow-card-hover ${className}`}
        {...rest}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={`rounded-lg border border-outline-variant bg-surface-container-lowest shadow-card ${
        hoverable ? "transition-shadow duration-200 hover:shadow-card-hover" : ""
      } ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
