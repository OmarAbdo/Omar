import React from "react";
import { motion } from "framer-motion";
import Sparkline from "./Sparkline";

interface KpiCardProps {
  label: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  sparklineData?: number[];
  bgColor?: string;
  borderColor?: string;
  textColor?: string;
  mutedColor?: string;
  accentColor?: string;
  delay?: number;
  compareValue?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  change,
  changeType = "neutral",
  sparklineData,
  bgColor = "#111827",
  borderColor = "rgba(255,255,255,0.06)",
  textColor = "#F1F5F9",
  mutedColor = "#64748B",
  accentColor = "#3B82F6",
  delay = 0,
  compareValue,
}) => {
  const changeColor =
    changeType === "positive"
      ? "#10B981"
      : changeType === "negative"
      ? "#F43F5E"
      : mutedColor;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className="rounded-xl p-5 flex items-center justify-between gap-4"
      style={{
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
      }}
    >
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wider" style={{ color: mutedColor }}>
          {label}
        </p>
        <p className="mt-1 text-2xl font-bold tabular-nums" style={{ color: textColor }}>
          {value}
        </p>
        {change && (
          <p className="mt-0.5 text-xs font-medium" style={{ color: changeColor }}>
            {changeType === "positive" ? "+" : ""}
            {change}
          </p>
        )}
        {compareValue && (
          <p className="mt-0.5 text-xs" style={{ color: mutedColor }}>
            vs {compareValue}
          </p>
        )}
      </div>
      {sparklineData && (
        <Sparkline data={sparklineData} color={accentColor} width={72} height={32} />
      )}
    </motion.div>
  );
};

export default KpiCard;
