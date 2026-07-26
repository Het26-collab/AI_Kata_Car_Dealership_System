import { useState, useEffect } from "react";

interface BarDatum {
  label: string;
  value: number;
}

export function SalesBarChart({ data, highlightLabel }: { data: BarDatum[]; highlightLabel?: string }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const width = 700;
  const height = 220;
  const barGap = 18;
  const barWidth = (width - barGap * (data.length - 1)) / data.length;

  // Animate bars growing upward on mount / data change
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    setAnimated(false);
    const raf = requestAnimationFrame(() => setAnimated(true));
    return () => cancelAnimationFrame(raf);
  }, [data]);

  return (
    <svg viewBox={`0 0 ${width} ${height + 24}`} className="w-full" role="img" aria-label="Monthly sales performance">
      {[0, 0.5, 1].map((f) => (
        <line
          key={f}
          x1={0}
          x2={width}
          y1={height - f * height}
          y2={height - f * height}
          stroke="#e1e2ed"
          strokeWidth={1}
        />
      ))}
      {data.map((d, i) => {
        const barHeight = (d.value / max) * height;
        const x = i * (barWidth + barGap);
        const isHighlighted = d.label === highlightLabel;
        return (
          <g key={d.label}>
            <rect
              x={x}
              y={animated ? height - barHeight : height}
              width={barWidth}
              height={animated ? barHeight : 0}
              rx={4}
              fill={isHighlighted ? "#2563eb" : "#dbeafe"}
              style={{
                transition: `y 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.06}s, height 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.06}s`,
              }}
            />
            <text
              x={x + barWidth / 2}
              y={height + 18}
              textAnchor="middle"
              fontSize="12"
              fill={isHighlighted ? "#191b23" : "#737686"}
              fontFamily="Inter, sans-serif"
              fontWeight={isHighlighted ? 600 : 400}
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
