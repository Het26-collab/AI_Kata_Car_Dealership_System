import { forwardRef, type ButtonHTMLAttributes } from "react";
import { motion, useReducedMotion } from "motion/react";
import { tapScale } from "../lib/motion";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart"> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-primary text-on-primary hover:opacity-90 shadow-sm",
  secondary:
    "bg-surface-container-lowest text-on-surface border border-outline-variant hover:bg-surface-container",
  ghost: "bg-transparent text-primary hover:bg-primary-container/40",
  danger:
    "bg-surface-container-lowest text-error border border-error-container hover:bg-error-container",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-md py-sm text-label-md rounded-md",
  md: "px-lg py-md text-body-md font-semibold rounded-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", isLoading, className = "", children, disabled, ...rest }, ref) => {
    const prefersReduced = useReducedMotion();
    const isDisabled = disabled || isLoading;

    return (
      <motion.button
        ref={ref}
        disabled={isDisabled}
        whileTap={!isDisabled && !prefersReduced ? tapScale : undefined}
        whileHover={!isDisabled && !prefersReduced ? { y: -1 } : undefined}
        transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className={`inline-flex items-center justify-center gap-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...rest}
      >
        {isLoading && (
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
        )}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
