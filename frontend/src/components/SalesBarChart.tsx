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
              y={height - barHeight}
              width={barWidth}
              height={barHeight}
              rx={4}
              fill={isHighlighted ? "#2563eb" : "#dbeafe"}
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
