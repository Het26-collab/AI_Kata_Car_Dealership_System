import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

interface AnimatedNumberProps {
  /** The target value to animate to */
  value: number;
  /** Format function applied to the animated number (e.g., formatCurrency, formatNumber) */
  format?: (n: number) => string;
  /** Duration in milliseconds (default: 700ms) */
  duration?: number;
  /** CSS class for the rendered span */
  className?: string;
}

/**
 * Animates a number from 0 → value on mount and when value changes.
 * Uses requestAnimationFrame for smooth 60fps counting.
 * Respects prefers-reduced-motion — skips animation if enabled.
 */
export function AnimatedNumber({
  value,
  format = (n) => String(n),
  duration = 700,
  className,
}: AnimatedNumberProps) {
  const prefersReduced = useReducedMotion();
  const [display, setDisplay] = useState(prefersReduced ? value : 0);
  const prevValue = useRef(0);
  const rafId = useRef<number>(0);

  useEffect(() => {
    if (prefersReduced) {
      setDisplay(value);
      return;
    }

    const start = prevValue.current;
    const end = value;
    const diff = end - start;
    if (diff === 0) return;

    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOut curve: 1 - (1 - t)^3
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + diff * eased;

      setDisplay(Math.round(current));

      if (progress < 1) {
        rafId.current = requestAnimationFrame(tick);
      } else {
        setDisplay(end);
        prevValue.current = end;
      }
    }

    rafId.current = requestAnimationFrame(tick);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [value, duration, prefersReduced]);

  return <span className={className}>{format(display)}</span>;
}
