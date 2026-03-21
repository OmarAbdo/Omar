import React from "react";
import { motion } from "framer-motion";
import { monthlyRevenue, topClientsByRevenue, kpiData } from "../safi.data";
import Sparkline from "../../shared/Sparkline";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const SafiReportsView: React.FC = () => {
  const totalRevenue = monthlyRevenue.reduce((s, m) => s + m.revenue, 0);
  const totalCollected = monthlyRevenue.reduce((s, m) => s + m.collected, 0);
  const avgMonthlyRevenue = Math.round(totalRevenue / monthlyRevenue.length);
  const bestMonth = monthlyRevenue.reduce((best, m) => (m.revenue > best.revenue ? m : best), monthlyRevenue[0]);

  // Payment aging data
  const agingBuckets = [
    { label: "Current", range: "0-30 days", count: 6, amount: 44600, color: "#10B981" },
    { label: "30-60 days", range: "31-60 days", count: 3, amount: 16100, color: "#F59E0B" },
    { label: "60-90 days", range: "61-90 days", count: 1, amount: 9200, color: "#F97316" },
    { label: "90+ days", range: "Over 90 days", count: 1, amount: 18900, color: "#F43F5E" },
  ];

  const maxAging = Math.max(...agingBuckets.map((b) => b.amount));

  return (
    <div className="p-6 overflow-y-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold" style={{ color: "#171717" }}>
          Reports
        </h2>
        <p className="text-sm mt-0.5" style={{ color: "#737373" }}>
          Financial overview and analytics
        </p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: fmt(totalRevenue), sub: "12 months", color: "#4338CA" },
          { label: "Total Collected", value: fmt(totalCollected), sub: `${Math.round((totalCollected / totalRevenue) * 100)}% collection rate`, color: "#10B981" },
          { label: "Avg Monthly", value: fmt(avgMonthlyRevenue), sub: "Per month", color: "#6366F1" },
          { label: "Best Month", value: bestMonth.month, sub: fmt(bestMonth.revenue), color: "#C9A96E" },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-xl p-5"
            style={{ backgroundColor: "#FAFAFA", border: "1px solid #E5E5E5" }}
          >
            <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "#737373" }}>
              {card.label}
            </p>
            <p className="mt-1 text-xl font-bold" style={{ color: "#171717" }}>
              {card.value}
            </p>
            <p className="mt-0.5 text-xs" style={{ color: card.color }}>
              {card.sub}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Revenue trend + Payment aging */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Monthly revenue trend */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl p-6"
          style={{ backgroundColor: "#FAFAFA", border: "1px solid #E5E5E5" }}
        >
          <h3 className="text-sm font-semibold mb-1" style={{ color: "#171717" }}>
            Revenue Trend
          </h3>
          <p className="text-xs mb-6" style={{ color: "#A3A3A3" }}>
            Monthly invoiced amounts
          </p>

          <div className="space-y-3">
            {monthlyRevenue.map((month, i) => {
              const pct = (month.revenue / bestMonth.revenue) * 100;
              return (
                <div key={month.month} className="flex items-center gap-3">
                  <span className="w-8 text-xs font-medium text-right" style={{ color: "#737373" }}>
                    {month.month}
                  </span>
                  <div className="flex-1 h-5 rounded-md overflow-hidden" style={{ backgroundColor: "#E5E5E5" }}>
                    <motion.div
                      className="h-full rounded-md"
                      style={{ backgroundColor: "#4338CA" }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.35 + i * 0.03, duration: 0.4, ease: "easeOut" }}
                    />
                  </div>
                  <span className="w-16 text-xs font-semibold text-right tabular-nums" style={{ color: "#171717" }}>
                    {fmt(month.revenue)}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Payment aging */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-xl p-6"
          style={{ backgroundColor: "#FAFAFA", border: "1px solid #E5E5E5" }}
        >
          <h3 className="text-sm font-semibold mb-1" style={{ color: "#171717" }}>
            Payment Aging
          </h3>
          <p className="text-xs mb-6" style={{ color: "#A3A3A3" }}>
            Outstanding amounts by age
          </p>

          <div className="space-y-5">
            {agingBuckets.map((bucket, i) => (
              <div key={bucket.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: bucket.color }} />
                    <span className="text-sm font-medium" style={{ color: "#525252" }}>
                      {bucket.label}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: "#E5E5E5", color: "#737373" }}>
                      {bucket.count}
                    </span>
                  </div>
                  <span className="text-sm font-semibold tabular-nums" style={{ color: "#171717" }}>
                    {fmt(bucket.amount)}
                  </span>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: "#E5E5E5" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: bucket.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(bucket.amount / maxAging) * 100}%` }}
                    transition={{ delay: 0.4 + i * 0.08, duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Total outstanding */}
          <div className="mt-6 pt-4" style={{ borderTop: "1px solid #E5E5E5" }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "#737373" }}>
                Total Outstanding
              </span>
              <span className="text-lg font-bold tabular-nums" style={{ color: "#F59E0B" }}>
                {fmt(kpiData.totalOutstanding)}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Top clients */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid #E5E5E5" }}
      >
        <div className="px-5 py-4" style={{ backgroundColor: "#FAFAFA", borderBottom: "1px solid #E5E5E5" }}>
          <h3 className="text-sm font-semibold" style={{ color: "#171717" }}>
            Top Clients by Revenue
          </h3>
        </div>
        <div style={{ backgroundColor: "#FFFFFF" }}>
          {topClientsByRevenue.map((client, i) => (
            <div
              key={client.id}
              className="px-5 py-4 flex items-center gap-4"
              style={{ borderBottom: i < topClientsByRevenue.length - 1 ? "1px solid #F5F5F5" : undefined }}
            >
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{
                  backgroundColor: i === 0 ? "#C9A96E20" : "#F5F5F5",
                  color: i === 0 ? "#C9A96E" : "#737373",
                }}
              >
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: "#171717" }}>
                  {client.name}
                </p>
                <p className="text-xs" style={{ color: "#A3A3A3" }}>
                  {client.invoiceCount} invoices · {client.city}
                </p>
              </div>
              <div className="shrink-0">
                <Sparkline
                  data={[
                    client.totalPaid * 0.3,
                    client.totalPaid * 0.5,
                    client.totalPaid * 0.7,
                    client.totalPaid * 0.85,
                    client.totalPaid,
                    client.totalBilled,
                  ]}
                  color="#4338CA"
                  width={56}
                  height={22}
                />
              </div>
              <div className="text-right shrink-0 w-24">
                <p className="text-sm font-bold tabular-nums" style={{ color: "#171717" }}>
                  {fmt(client.totalBilled)}
                </p>
                <p className="text-[10px]" style={{ color: "#10B981" }}>
                  {fmt(client.totalPaid)} paid
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SafiReportsView;
