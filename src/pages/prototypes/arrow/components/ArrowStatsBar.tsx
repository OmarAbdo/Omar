import React from "react";
import { motion } from "framer-motion";

interface StatItem {
  label: string;
  value: number | string;
  color: string;
  total?: number; // for progress ring
}

interface Props {
  stats: StatItem[];
}

const ProgressRing: React.FC<{ value: number; total: number; color: string; size?: number }> = ({
  value,
  total,
  color,
  size = 32,
}) => {
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = total > 0 ? (value / total) * circumference : 0;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#E2E8F0"
        strokeWidth={strokeWidth}
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: circumference - progress }}
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
      />
    </svg>
  );
};

const ArrowStatsBar: React.FC<Props> = ({ stats }) => (
  <div className="px-4 py-3 grid grid-cols-5 gap-2" style={{ borderBottom: "1px solid #E2E8F0" }}>
    {stats.map((s, i) => (
      <motion.div
        key={s.label}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
        className="flex flex-col items-center gap-1"
      >
        {s.total !== undefined ? (
          <div className="relative flex items-center justify-center">
            <ProgressRing value={Number(s.value)} total={s.total} color={s.color} />
            <span
              className="absolute text-xs font-bold"
              style={{ color: s.color }}
            >
              {s.value}
            </span>
          </div>
        ) : (
          <span className="text-lg font-bold" style={{ color: s.color }}>
            {s.value}
          </span>
        )}
        <span
          className="text-[10px] font-medium uppercase tracking-wider"
          style={{ color: "#94A3B8" }}
        >
          {s.label}
        </span>
      </motion.div>
    ))}
  </div>
);

export default ArrowStatsBar;
