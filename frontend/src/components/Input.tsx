import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leadingIcon?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leadingIcon, id, className = "", ...rest }, ref) => {
    const inputId = id ?? rest.name;
    return (
      <div className="flex flex-col gap-xs">
        {label && (
          <label htmlFor={inputId} className="text-body-md font-medium text-on-surface">
            {label}
          </label>
        )}
        <div className="relative">
          {leadingIcon && (
            <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant">
              {leadingIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full rounded-lg border bg-surface-container-lowest px-md py-md text-body-md text-on-surface placeholder:text-on-surface-variant/70 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 ${
              error ? "border-error" : "border-outline-variant focus:border-primary"
            } ${leadingIcon ? "pl-2xl" : ""} ${className}`}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...rest}
          />
        </div>
        {error && (
          <p id={`${inputId}-error`} className="text-label-md text-error">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={`${inputId}-hint`} className="text-label-md text-on-surface-variant">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
