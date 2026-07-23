import { forwardRef, type SelectHTMLAttributes } from "react";

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
        {error && <p className="text-label-md text-error">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
