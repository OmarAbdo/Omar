import React from "react";
import { motion } from "framer-motion";
import { monthlyRevenue } from "../safi.data";

const SafiRevenueChart: React.FC = () => {
  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.revenue));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.5 }}
      className="rounded-xl p-6"
      style={{ backgroundColor: "#FAFAFA", border: "1px solid #E5E5E5" }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold" style={{ color: "#171717" }}>
            Revenue Overview
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "#A3A3A3" }}>
            Monthly invoiced vs collected
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: "#4338CA" }} />
            <span style={{ color: "#737373" }}>Invoiced</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: "#C9A96E" }} />
            <span style={{ color: "#737373" }}>Collected</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex items-end gap-2 h-44">
        {monthlyRevenue.map((month, i) => {
          const invoicedH = (month.revenue / maxRevenue) * 100;
          const collectedH = (month.collected / maxRevenue) * 100;

          return (
            <div key={month.month} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="w-full flex items-end justify-center gap-0.5 h-40 relative">
                {/* Tooltip */}
                <div
                  className="absolute -top-14 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-10 px-2.5 py-1.5 rounded-lg text-[10px] whitespace-nowrap"
                  style={{ backgroundColor: "#171717", color: "#FAFAFA" }}
                >
                  <div className="font-medium">${(month.revenue / 1000).toFixed(1)}k invoiced</div>
                  <div style={{ color: "#C9A96E" }}>${(month.collected / 1000).toFixed(1)}k collected</div>
                </div>

                {/* Invoiced bar */}
                <motion.div
                  className="w-[45%] rounded-t-sm"
                  style={{ backgroundColor: "#4338CA", height: `${invoicedH}%` }}
                  initial={{ height: 0 }}
                  animate={{ height: `${invoicedH}%` }}
                  transition={{ delay: 0.4 + i * 0.04, duration: 0.5, ease: "easeOut" }}
                />
                {/* Collected bar */}
                <motion.div
                  className="w-[45%] rounded-t-sm"
                  style={{ backgroundColor: "#C9A96E", height: `${collectedH}%` }}
                  initial={{ height: 0 }}
                  animate={{ height: `${collectedH}%` }}
                  transition={{ delay: 0.45 + i * 0.04, duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <span className="text-[10px] font-medium" style={{ color: "#A3A3A3" }}>
                {month.month}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default SafiRevenueChart;
