import { useToast } from "../hooks/useToast";
import type { ToastVariant } from "../context/ToastContext";

const VARIANT_STYLES: Record<ToastVariant, { border: string; icon: string; iconColor: string }> = {
  success: { border: "border-l-success", icon: "check_circle", iconColor: "text-success" },
  error: { border: "border-l-error", icon: "error", iconColor: "text-error" },
  info: { border: "border-l-primary", icon: "info", iconColor: "text-primary" },
  warning: { border: "border-l-amber-500", icon: "warning", iconColor: "text-amber-500" },
};

export function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed right-lg top-20 z-[60] flex w-full max-w-sm flex-col gap-sm" aria-live="polite">
      {toasts.map((toast) => {
        const style = VARIANT_STYLES[toast.variant];
        return (
          <div
            key={toast.id}
            className={`flex items-start gap-sm rounded-lg border border-l-4 border-outline-variant bg-surface-container-lowest p-md shadow-modal ${style.border}`}
            role="status"
          >
            <span className={`material-symbols-outlined ${style.iconColor}`} aria-hidden="true">
              {style.icon}
            </span>
            <div className="flex-1">
              <p className="text-body-md font-semibold text-on-surface">{toast.title}</p>
              {toast.description && (
                <p className="mt-xs text-label-md text-on-surface-variant">{toast.description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="text-on-surface-variant hover:text-on-surface"
              aria-label="Dismiss notification"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
