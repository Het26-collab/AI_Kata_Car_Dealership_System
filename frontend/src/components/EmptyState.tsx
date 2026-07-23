import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon = "directions_car", title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-outline-variant bg-surface-container-lowest px-lg py-3xl text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-container text-on-surface-variant">
        <span className="material-symbols-outlined text-[32px]">{icon}</span>
      </span>
      <h3 className="mt-lg text-title-lg text-on-surface">{title}</h3>
      <p className="mt-sm max-w-sm text-body-md text-on-surface-variant">{description}</p>
      {action && <div className="mt-lg flex items-center gap-sm">{action}</div>}
    </div>
  );
}
