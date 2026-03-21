import React from "react";
import { motion } from "framer-motion";

interface Segment {
  label: string;
  value: number;
  color: string;
}

interface Props {
  segments: Segment[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerSub?: string;
}

const PulseDonutChart: React.FC<Props> = ({
  segments,
  size = 140,
  strokeWidth = 20,
  centerLabel,
  centerSub,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  let accumulated = 0;

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} className="shrink-0" style={{ transform: "rotate(-90deg)" }}>
        {/* Background ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {segments.map((seg) => {
          const pct = seg.value / total;
          const dashArray = circumference * pct;
          const dashOffset = -circumference * accumulated;
          accumulated += pct;
          return (
            <motion.circle
              key={seg.label}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashArray} ${circumference - dashArray}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="butt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          );
        })}
        {/* Center text */}
        {centerLabel && (
          <g style={{ transform: "rotate(90deg)", transformOrigin: "center" }}>
            <text
              x={center}
              y={center - 4}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#F1F5F9"
              fontSize="18"
              fontWeight="700"
              fontFamily="Inter, sans-serif"
            >
              {centerLabel}
            </text>
            {centerSub && (
              <text
                x={center}
                y={center + 14}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#64748B"
                fontSize="10"
                fontFamily="Inter, sans-serif"
              >
                {centerSub}
              </text>
            )}
          </g>
        )}
      </svg>

      {/* Legend */}
      <div className="space-y-2">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
            <span className="text-xs" style={{ color: "#94A3B8" }}>{seg.label}</span>
            <span className="text-xs font-mono font-medium" style={{ color: "#F1F5F9" }}>{seg.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PulseDonutChart;
