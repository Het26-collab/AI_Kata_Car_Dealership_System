/**
 * DriveFlow Motion Design System
 * ─────────────────────────────────
 * Centralized motion configuration for a cohesive, premium animation language.
 * Inspired by Linear, Stripe Dashboard, Vercel, and Framer.
 *
 * All animations use GPU-accelerated properties (transform, opacity) for 60 FPS.
 * Every variant respects prefers-reduced-motion via the useReducedMotion hook.
 */

import type { Variants, Transition } from "motion/react";

// ── Easing Curves ─────────────────────────────────────────────────────────────
export const ease = {
  out: [0.16, 1, 0.3, 1] as [number, number, number, number],
  inOut: [0.4, 0, 0.2, 1] as [number, number, number, number],
  in: [0.4, 0, 1, 1] as [number, number, number, number],
};

// ── Duration Tokens (in seconds) ──────────────────────────────────────────────
export const duration = {
  fast: 0.15,
  normal: 0.2,
  medium: 0.4,
  slow: 0.7,
};

// ── Shared Transitions ────────────────────────────────────────────────────────
export const spring = {
  gentle: { type: "spring", stiffness: 300, damping: 30 } as Transition,
};

export const transition = {
  fast: { duration: duration.fast, ease: ease.out } as Transition,
  normal: { duration: duration.normal, ease: ease.out } as Transition,
  medium: { duration: duration.medium, ease: ease.out } as Transition,
  slow: { duration: duration.slow, ease: ease.out } as Transition,
};

// ── Reusable Variants ─────────────────────────────────────────────────────────

/** Fade in + translate up — the primary entrance animation */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.medium, ease: ease.out },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: duration.normal, ease: ease.in },
  },
};

/** Subtle fade in — for secondary elements */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: duration.medium, ease: ease.out },
  },
  exit: {
    opacity: 0,
    transition: { duration: duration.fast, ease: ease.in },
  },
};

/** Stagger container — orchestrates children entrance */
export const staggerContainer: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
};

/** Stagger item — pairs with staggerContainer */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.medium, ease: ease.out },
  },
};

/** Page transition variant */
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: ease.out },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: duration.normal, ease: ease.in },
  },
};

/** Modal overlay backdrop */
export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: duration.normal, ease: ease.out } },
  exit: { opacity: 0, transition: { duration: duration.fast, ease: ease.in } },
};

/** Modal / dialog panel */
export const modalPanelVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.25, ease: ease.out },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 8,
    transition: { duration: duration.fast, ease: ease.in },
  },
};

/** Drawer slide in from right */
export const drawerVariants: Variants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: { duration: 0.3, ease: ease.out },
  },
  exit: {
    x: "100%",
    transition: { duration: 0.25, ease: ease.in },
  },
};

/** Toast notification */
export const toastVariants: Variants = {
  hidden: { opacity: 0, y: -8, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: duration.normal, ease: ease.out },
  },
  exit: {
    opacity: 0,
    x: 80,
    transition: { duration: duration.fast, ease: ease.in },
  },
};

/** Dropdown menu */
export const dropdownVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98, y: -4 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: duration.fast, ease: ease.out },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: -4,
    transition: { duration: 0.1, ease: ease.in },
  },
};

// ── Hover / Tap Helpers ───────────────────────────────────────────────────────

/** Standard button tap scale */
export const tapScale = { scale: 0.97 };

/** Subtle hover lift for cards and buttons */
export const hoverLift = { y: -2, transition: { duration: duration.fast, ease: ease.out } };

/** Card hover lift — slightly more pronounced */
export const cardHoverLift = { y: -4, transition: { duration: duration.fast, ease: ease.out } };
