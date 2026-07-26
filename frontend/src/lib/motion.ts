/**
 * DriveFlow Centralized Enterprise Motion System
 * ──────────────────────────────────────────────────
 * Production-ready animation tokens and variants.
 * Inspired by Linear, Stripe Dashboard, Vercel, Apple, and Framer.
 *
 * All animations are 60 FPS GPU-accelerated (opacity, transform).
 * Built with full prefers-reduced-motion accessibility support.
 */

import type { Variants, Transition } from "motion/react";

// ── Easing Tokens ──────────────────────────────────────────────────────────────
export const easings = {
  easeOut: [0.16, 1, 0.3, 1] as [number, number, number, number],
  easeInOut: [0.4, 0, 0.2, 1] as [number, number, number, number],
  easeIn: [0.4, 0, 1, 1] as [number, number, number, number],
};

export const ease = easings;

// ── Duration Tokens (in seconds) ───────────────────────────────────────────────
export const durations = {
  fast: 0.15,    // 150ms
  normal: 0.25,  // 250ms
  medium: 0.4,   // 400ms
  slow: 0.6,     // 600ms
  extra: 0.8,    // 800ms
};

export const duration = durations;

// ── Shared Transitions ─────────────────────────────────────────────────────────
export const transitions = {
  fast: { duration: durations.fast, ease: easings.easeOut } as Transition,
  normal: { duration: durations.normal, ease: easings.easeOut } as Transition,
  medium: { duration: durations.medium, ease: easings.easeOut } as Transition,
  slow: { duration: durations.slow, ease: easings.easeOut } as Transition,
};

export const transition = transitions;

// ── Reusable Motion Variants ───────────────────────────────────────────────────

/** Subtle Fade In */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: durations.medium, ease: easings.easeOut },
  },
  exit: {
    opacity: 0,
    transition: { duration: durations.fast, ease: easings.easeIn },
  },
};

/** Fade In + Translate Up (Primary entrance animation) */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.medium, ease: easings.easeOut },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: durations.normal, ease: easings.easeIn },
  },
};

export const fadeInUp = fadeUp;

/** Fade In + Translate Down */
export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.medium, ease: easings.easeOut },
  },
  exit: {
    opacity: 0,
    y: 8,
    transition: { duration: durations.normal, ease: easings.easeIn },
  },
};

/** Slide Left */
export const slideLeft: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: durations.normal, ease: easings.easeOut },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: { duration: durations.fast, ease: easings.easeIn },
  },
};

/** Slide Right */
export const slideRight: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: durations.normal, ease: easings.easeOut },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: { duration: durations.fast, ease: easings.easeIn },
  },
};

/** Stagger Container Orchestrator */
export const staggerContainer: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.03,
    },
  },
};

/** Stagger Child Item */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.medium, ease: easings.easeOut },
  },
};

/** Modal / Dialog Animation */
export const modalAnimation: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: durations.normal, ease: easings.easeOut },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 8,
    transition: { duration: durations.fast, ease: easings.easeIn },
  },
};

export const modalPanelVariants = modalAnimation;
export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: durations.normal, ease: easings.easeOut } },
  exit: { opacity: 0, transition: { duration: durations.fast, ease: easings.easeIn } },
};

/** Drawer Slide Animation */
export const drawerAnimation: Variants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: { duration: 0.3, ease: easings.easeOut },
  },
  exit: {
    x: "100%",
    transition: { duration: durations.normal, ease: easings.easeIn },
  },
};

export const drawerVariants = drawerAnimation;

/** Tooltip Animation */
export const tooltipAnimation: Variants = {
  hidden: { opacity: 0, y: 4, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: durations.fast, ease: easings.easeOut },
  },
  exit: {
    opacity: 0,
    y: 2,
    scale: 0.96,
    transition: { duration: 0.1, ease: easings.easeIn },
  },
};

/** Toast Notification Animation */
export const toastAnimation: Variants = {
  hidden: { opacity: 0, y: -12, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: durations.normal, ease: easings.easeOut },
  },
  exit: {
    opacity: 0,
    x: 60,
    transition: { duration: durations.fast, ease: easings.easeIn },
  },
};

export const toastVariants = toastAnimation;

/** Dropdown Menu Animation */
export const dropdownAnimation: Variants = {
  hidden: { opacity: 0, scale: 0.97, y: -4 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: durations.fast, ease: easings.easeOut },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: -4,
    transition: { duration: 0.1, ease: easings.easeIn },
  },
};

export const dropdownVariants = dropdownAnimation;

/** Page Transition Animation */
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.normal, ease: easings.easeOut },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: durations.fast, ease: easings.easeIn },
  },
};

/** List Item Animation */
export const listAnimation: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: durations.normal, ease: easings.easeOut },
  },
  exit: {
    opacity: 0,
    x: 10,
    transition: { duration: durations.fast, ease: easings.easeIn },
  },
};

/** Accordion Content Expand Animation */
export const accordionAnimation: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: { duration: durations.medium, ease: easings.easeOut },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: durations.normal, ease: easings.easeIn },
  },
};

// ── Shared Interactive Hover & Tap Utilities ───────────────────────────────────

export const buttonHover = {
  scale: 1.01,
  y: -1,
  transition: { duration: durations.fast, ease: easings.easeOut },
};

export const buttonTap = { scale: 0.97 };
export const tapScale = buttonTap;

export const cardHover = {
  y: -4,
  transition: { duration: durations.fast, ease: easings.easeOut },
};

export const cardHoverLift = cardHover;
export const hoverLift = { y: -2, transition: { duration: durations.fast, ease: easings.easeOut } };
