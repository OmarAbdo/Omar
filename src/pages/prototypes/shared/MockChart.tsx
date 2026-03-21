import React from "react";

interface ChartProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  secondaryColor?: string;
  type?: "line" | "area" | "bar";
  showGrid?: boolean;
  gridColor?: string;
  animated?: boolean;
}

function dataToPoints(data: number[], width: number, height: number, padding: number) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  return data.map((val, i) => ({
    x: (i / (data.length - 1)) * (width - padding * 2) + padding,
    y: height - padding - ((val - min) / range) * (height - padding * 2),
  }));
}

function pointsToSmoothPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return "";
  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx1 = prev.x + (curr.x - prev.x) * 0.4;
    const cpx2 = curr.x - (curr.x - prev.x) * 0.4;
    d += ` C ${cpx1},${prev.y} ${cpx2},${curr.y} ${curr.x},${curr.y}`;
  }
  return d;
}

const MockChart: React.FC<ChartProps> = ({
  data,
  width = 500,
  height = 200,
  color = "#3B82F6",
  secondaryColor,
  type = "line",
  showGrid = true,
  gridColor = "rgba(255,255,255,0.06)",
  animated = true,
}) => {
  const padding = 20;
  const points = dataToPoints(data, width, height, padding);

  if (type === "bar") {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const barWidth = (width - padding * 2) / data.length - 4;

    return (
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        {showGrid &&
          [0.25, 0.5, 0.75].map((frac) => (
            <line
              key={frac}
              x1={padding}
              y1={height - padding - frac * (height - padding * 2)}
              x2={width - padding}
              y2={height - padding - frac * (height - padding * 2)}
              stroke={gridColor}
              strokeDasharray="4 4"
            />
          ))}
        {data.map((val, i) => {
          const barHeight = ((val - min) / range) * (height - padding * 2);
          const x = (i / data.length) * (width - padding * 2) + padding + 2;
          return (
            <rect
              key={i}
              x={x}
              y={height - padding - barHeight}
              width={barWidth}
              height={barHeight}
              rx={3}
              fill={color}
              opacity={0.8}
            >
              {animated && (
                <animate
                  attributeName="height"
                  from="0"
                  to={barHeight}
                  dur="0.8s"
                  begin={`${i * 0.05}s`}
                  fill="freeze"
                />
              )}
            </rect>
          );
        })}
      </svg>
    );
  }

  const linePath = pointsToSmoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x},${height - padding} L ${points[0].x},${height - padding} Z`;

  const gradientId = `chart-gradient-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={secondaryColor || color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={secondaryColor || color} stopOpacity={0} />
        </linearGradient>
      </defs>

      {showGrid &&
        [0.25, 0.5, 0.75].map((frac) => (
          <line
            key={frac}
            x1={padding}
            y1={height - padding - frac * (height - padding * 2)}
            x2={width - padding}
            y2={height - padding - frac * (height - padding * 2)}
            stroke={gridColor}
            strokeDasharray="4 4"
          />
        ))}

      {(type === "area" || type === "line") && (
        <path d={areaPath} fill={`url(#${gradientId})`} />
      )}

      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {points.map((pt, i) =>
        i === points.length - 1 ? (
          <circle key={i} cx={pt.x} cy={pt.y} r={4} fill={color}>
            {animated && (
              <animate
                attributeName="r"
                values="4;6;4"
                dur="2s"
                repeatCount="indefinite"
              />
            )}
          </circle>
        ) : null
      )}
    </svg>
  );
};

export default MockChart;
