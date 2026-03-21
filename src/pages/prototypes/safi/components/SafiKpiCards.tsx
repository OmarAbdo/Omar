import React from "react";
import { motion } from "framer-motion";
import Sparkline from "../../shared/Sparkline";
import { kpiData, monthlyRevenue } from "../safi.data";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const cards = [
  {
    label: "Total Revenue",
    value: fmt(kpiData.totalRevenue),
    sub: "All time",
    color: "#4338CA",
  },
  {
    label: "Paid",
    value: fmt(kpiData.totalPaid),
    sub: "Collected",
    color: "#10B981",
  },
  {
    label: "Outstanding",
    value: fmt(kpiData.totalOutstanding),
    sub: "Awaiting payment",
    color: "#F59E0B",
  },
  {
    label: "Overdue",
    value: fmt(kpiData.totalOverdue),
    sub: "Needs follow-up",
    color: "#F43F5E",
  },
];

const SafiKpiCards: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {cards.map((card, i) => (
      <motion.div
        key={card.label}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.08, duration: 0.5 }}
        className="rounded-xl p-5 flex items-center justify-between"
        style={{
          backgroundColor: "#FAFAFA",
          border: "1px solid #E5E5E5",
        }}
      >
        <div>
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "#737373" }}>
            {card.label}
          </p>
          <p className="mt-1 text-xl font-bold" style={{ color: "#171717" }}>
            {card.value}
          </p>
          <p className="mt-0.5 text-xs" style={{ color: "#A3A3A3" }}>
            {card.sub}
          </p>
        </div>
        <Sparkline data={monthlyRevenue.map((m) => m.revenue)} color={card.color} width={64} height={28} />
      </motion.div>
    ))}
  </div>
);

export default SafiKpiCards;
