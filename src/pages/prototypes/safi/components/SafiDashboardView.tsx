import React from "react";
import { motion } from "framer-motion";
import SafiKpiCards from "./SafiKpiCards";
import SafiRevenueChart from "./SafiRevenueChart";
import SafiActivityFeed from "./SafiActivityFeed";
import { kpiData, invoices } from "../safi.data";
import StatusPill from "../../shared/StatusPill";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const SafiDashboardView: React.FC = () => {
  const recentInvoices = invoices.slice(-5).reverse();

  return (
    <div className="p-6 space-y-6 overflow-y-auto">
      {/* Page title */}
      <div>
        <h2 className="text-xl font-bold" style={{ color: "#171717" }}>
          Dashboard
        </h2>
        <p className="text-sm mt-0.5" style={{ color: "#737373" }}>
          Overview of your invoicing activity
        </p>
      </div>

      {/* KPIs */}
      <SafiKpiCards />

      {/* Chart + Status breakdown */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <SafiRevenueChart />
        </div>

        {/* Invoice status breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="rounded-xl p-6"
          style={{ backgroundColor: "#FAFAFA", border: "1px solid #E5E5E5" }}
        >
          <h3 className="text-sm font-semibold mb-5" style={{ color: "#171717" }}>
            Invoice Status
          </h3>

          {/* Donut-like visual using stacked bars */}
          <div className="flex gap-1 h-3 rounded-full overflow-hidden mb-6">
            <div
              className="rounded-l-full transition-all"
              style={{
                width: `${(kpiData.paidCount / kpiData.invoiceCount) * 100}%`,
                backgroundColor: "#10B981",
              }}
            />
            <div
              className="transition-all"
              style={{
                width: `${(kpiData.pendingCount / kpiData.invoiceCount) * 100}%`,
                backgroundColor: "#F59E0B",
              }}
            />
            <div
              className="rounded-r-full transition-all"
              style={{
                width: `${(kpiData.overdueCount / kpiData.invoiceCount) * 100}%`,
                backgroundColor: "#F43F5E",
              }}
            />
          </div>

          <div className="space-y-4">
            {[
              { label: "Paid", count: kpiData.paidCount, color: "#10B981", amount: kpiData.totalPaid },
              { label: "Pending", count: kpiData.pendingCount, color: "#F59E0B", amount: kpiData.totalOutstanding - kpiData.totalOverdue },
              { label: "Overdue", count: kpiData.overdueCount, color: "#F43F5E", amount: kpiData.totalOverdue },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm" style={{ color: "#525252" }}>
                    {item.label}
                  </span>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: "#E5E5E5", color: "#737373" }}
                  >
                    {item.count}
                  </span>
                </div>
                <span className="text-sm font-semibold" style={{ color: "#171717" }}>
                  {fmt(item.amount)}
                </span>
              </div>
            ))}
          </div>

          {/* Collection rate */}
          <div className="mt-6 pt-4" style={{ borderTop: "1px solid #E5E5E5" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium" style={{ color: "#737373" }}>
                Collection Rate
              </span>
              <span className="text-sm font-bold" style={{ color: "#4338CA" }}>
                {kpiData.collectionRate}%
              </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#E5E5E5" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: "#4338CA" }}
                initial={{ width: 0 }}
                animate={{ width: `${kpiData.collectionRate}%` }}
                transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent invoices + Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent invoices mini-table */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: "#FAFAFA", border: "1px solid #E5E5E5" }}
        >
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #E5E5E5" }}>
            <h3 className="text-sm font-semibold" style={{ color: "#171717" }}>
              Recent Invoices
            </h3>
            <span className="text-xs font-medium cursor-pointer transition-colors hover:opacity-80" style={{ color: "#4338CA" }}>
              View all
            </span>
          </div>
          <div>
            {recentInvoices.map((inv, i) => (
              <div
                key={inv.id}
                className="px-5 py-3 flex items-center justify-between transition-colors duration-150 hover:bg-white cursor-default"
                style={{ borderBottom: i < recentInvoices.length - 1 ? "1px solid #F5F5F5" : undefined }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-semibold shrink-0" style={{ color: "#4338CA" }}>
                    {inv.number}
                  </span>
                  <span className="text-sm truncate" style={{ color: "#525252" }}>
                    {inv.client}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <StatusPill status={inv.status} />
                  <span className="text-sm font-semibold w-20 text-right" style={{ color: "#171717" }}>
                    {fmt(inv.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Activity feed */}
        <SafiActivityFeed limit={5} />
      </div>
    </div>
  );
};

export default SafiDashboardView;
