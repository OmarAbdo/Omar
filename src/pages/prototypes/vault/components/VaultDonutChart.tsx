import React from "react";
import { motion } from "framer-motion";

interface Segment {
  label: string;
  pct: number;
  color: string;
}

interface Props {
  segments: Segment[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string;
}

const VaultDonutChart: React.FC<Props> = ({
  segments,
  size = 160,
  strokeWidth = 22,
  centerLabel,
  centerValue,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let cumulativeOffset = 0;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        {segments.map((seg, i) => {
          const dashLength = (seg.pct / 100) * circumference;
          const dashOffset = -cumulativeOffset;
          cumulativeOffset += dashLength;

          return (
            <motion.circle
              key={seg.label}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="butt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
            />
          );
        })}
      </svg>

      {/* Center text */}
      {(centerLabel || centerValue) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {centerValue && (
            <span className="text-lg font-semibold" style={{ color: "#FAFAF9" }}>
              {centerValue}
            </span>
          )}
          {centerLabel && (
            <span className="text-[10px]" style={{ color: "#71717A" }}>
              {centerLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default VaultDonutChart;
