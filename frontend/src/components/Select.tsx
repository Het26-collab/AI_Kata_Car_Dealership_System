import { forwardRef, type SelectHTMLAttributes } from "react";
import { motion, AnimatePresence } from "motion/react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, id, className = "", children, ...rest }, ref) => {
    const selectId = id ?? rest.name;
    return (
      <div className="flex flex-col gap-xs">
        {label && (
          <label htmlFor={selectId} className="text-body-md font-medium text-on-surface">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`h-[44px] w-full rounded-lg border bg-surface-container-lowest px-md text-body-md text-on-surface transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 ${
            error ? "border-error" : "border-outline-variant focus:border-primary"
          } ${className}`}
          {...rest}
        >
          {children}
        </select>
        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              key="error"
              className="text-label-md text-error"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Select.displayName = "Select";
