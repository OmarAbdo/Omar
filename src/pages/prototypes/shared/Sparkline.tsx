import React from "react";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  fillOpacity?: number;
}

const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 80,
  height = 28,
  color = "#3B82F6",
  fillOpacity = 0.1,
}) => {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 2;

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
    const y = height - padding - ((val - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const polylinePoints = points.join(" ");
  const fillPoints = `${padding},${height - padding} ${polylinePoints} ${width - padding},${height - padding}`;

  return (
    <svg width={width} height={height} className="inline-block">
      <polygon points={fillPoints} fill={color} opacity={fillOpacity} />
      <polyline
        points={polylinePoints}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Sparkline;
