import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hoverable?: boolean;
}

export function Card({ children, hoverable = false, className = "", ...rest }: CardProps) {
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
