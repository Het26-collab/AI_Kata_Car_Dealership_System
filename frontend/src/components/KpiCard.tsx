import type { ReactNode } from "react";
import { Card } from "./Card";

interface KpiCardProps {
  icon: string;
  label: string;
  value: string;
  tone?: "neutral" | "primary" | "warning" | "success";
  trailing?: ReactNode;
}

const TONE_STYLES: Record<NonNullable<KpiCardProps["tone"]>, string> = {
  neutral: "bg-surface-container text-on-surface-variant",
  primary: "bg-primary-container text-on-primary-container",
  warning: "bg-warning-container text-on-warning-container",
  success: "bg-success-container text-on-success-container",
};

export function KpiCard({ icon, label, value, tone = "neutral", trailing }: KpiCardProps) {
  return (
    <Card className="p-lg" hoverable>
      <div className="flex items-start justify-between">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${TONE_STYLES[tone]}`}
          aria-hidden="true"
        >
          <span className="material-symbols-outlined">{icon}</span>
        </span>
        {trailing}
      </div>
      <p className="mt-md text-label-sm uppercase tracking-wide text-on-surface-variant">{label}</p>
      <p className="mt-xs text-headline-md text-on-surface">{value}</p>
    </Card>
  );
}
