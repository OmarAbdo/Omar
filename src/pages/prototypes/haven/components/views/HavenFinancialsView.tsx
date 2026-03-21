import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { paymentRecords, monthlyIncome, properties } from "../../haven.data";
import HavenDataTable, { type Column } from "../HavenDataTable";
import type { PaymentRecord } from "../../haven.data";

// ── Income Chart (SVG) ──────────────────

const IncomeChart: React.FC = () => {
  const maxVal = Math.max(...monthlyIncome.map((m) => m.expected));
  const barWidth = 28;
  const gap = 12;
  const chartHeight = 180;
  const chartWidth = monthlyIncome.length * (barWidth * 2 + gap) + gap;

  return (
    <div className="rounded-xl p-5" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold" style={{ color: "#0F172A" }}>Monthly Income</h3>
          <p className="text-[11px]" style={{ color: "#94A3B8" }}>Expected vs collected rent (12 months)</p>
        </div>
        <div className="flex items-center gap-4 text-[10px]">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded" style={{ backgroundColor: "#E2E8F0" }} /> Expected
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded" style={{ backgroundColor: "#0D9488" }} /> Collected
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg width={chartWidth} height={chartHeight + 30} className="block">
          {monthlyIncome.map((m, i) => {
            const x = gap + i * (barWidth * 2 + gap);
            const expectedH = (m.expected / maxVal) * chartHeight;
            const collectedH = (m.collected / maxVal) * chartHeight;
            const label = m.month.split(" ")[0];

            return (
              <g key={m.month}>
                {/* Expected bar */}
                <motion.rect
                  x={x}
                  y={chartHeight - expectedH}
                  width={barWidth}
                  height={expectedH}
                  rx={4}
                  fill="#E2E8F0"
                  initial={{ height: 0, y: chartHeight }}
                  animate={{ height: expectedH, y: chartHeight - expectedH }}
                  transition={{ duration: 0.5, delay: i * 0.04 }}
                />
                {/* Collected bar */}
                <motion.rect
                  x={x + barWidth + 2}
                  y={chartHeight - collectedH}
                  width={barWidth}
                  height={collectedH}
                  rx={4}
                  fill={m.collected >= m.expected ? "#0D9488" : "#F59E0B"}
                  initial={{ height: 0, y: chartHeight }}
                  animate={{ height: collectedH, y: chartHeight - collectedH }}
                  transition={{ duration: 0.5, delay: i * 0.04 + 0.1 }}
                />
                {/* Month label */}
                <text
                  x={x + barWidth}
                  y={chartHeight + 18}
                  textAnchor="middle"
                  fontSize={10}
                  fill="#94A3B8"
                >
                  {label}
                </text>
              </g>
            );
          })}
          {/* Baseline */}
          <line x1={0} y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#E2E8F0" strokeWidth={1} />
        </svg>
      </div>
    </div>
  );
};

// ── Method badge ─────────────────────────

const methodLabels: Record<string, { label: string; bg: string; color: string }> = {
  bank_transfer: { label: "Bank Transfer", bg: "#EFF6FF", color: "#2563EB" },
  cheque: { label: "Cheque", bg: "#F5F3FF", color: "#7C3AED" },
  card: { label: "Card", bg: "#ECFDF5", color: "#059669" },
  cash: { label: "Cash", bg: "#FEF3C7", color: "#D97706" },
};

const statusBadge: Record<string, { label: string; bg: string; color: string; border: string }> = {
  completed: { label: "Completed", bg: "#F0FDF4", color: "#166534", border: "#BBF7D0" },
  pending: { label: "Pending", bg: "#FFFBEB", color: "#92400E", border: "#FDE68A" },
  failed: { label: "Failed", bg: "#FEF2F2", color: "#991B1B", border: "#FECACA" },
  refunded: { label: "Refunded", bg: "#F8FAFC", color: "#64748B", border: "#E2E8F0" },
};

// ── Component ────────────────────────────

const HavenFinancialsView: React.FC = () => {
  const stats = useMemo(() => {
    const allUnits = properties.flatMap((p) => p.units);
    const totalExpected = allUnits.filter((u) => u.status !== "vacant").reduce((s, u) => s + u.monthlyRent, 0);
    const totalCollected = paymentRecords
      .filter((p) => p.date.startsWith("2024-03") && p.status === "completed")
      .reduce((s, p) => s + p.amount, 0);
    const collectionRate = totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0;
    const outstanding = totalExpected - totalCollected;
    const vacancyLoss = allUnits.filter((u) => u.status === "vacant").reduce((s, u) => s + u.monthlyRent, 0);

    return { totalExpected, totalCollected, collectionRate, outstanding, vacancyLoss };
  }, []);

  const columns: Column<PaymentRecord>[] = [
    {
      key: "date",
      label: "Date",
      format: (v) => <span className="text-xs">{v as string}</span>,
    },
    {
      key: "tenantName",
      label: "Tenant",
      format: (_, row) => (
        <div>
          <p className="text-xs font-medium" style={{ color: "#0F172A" }}>{row.tenantName}</p>
          <p className="text-[10px]" style={{ color: "#94A3B8" }}>{row.unitLabel}</p>
        </div>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      align: "right",
      format: (v) => <span className="font-semibold text-xs">AED {(v as number).toLocaleString()}</span>,
    },
    {
      key: "method",
      label: "Method",
      format: (v) => {
        const m = methodLabels[v as string] || { label: v, bg: "#F1F5F9", color: "#64748B" };
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: m.bg, color: m.color }}>
            {m.label}
          </span>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      format: (v) => {
        const s = statusBadge[v as string];
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ backgroundColor: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
            {s.label}
          </span>
        );
      },
    },
    {
      key: "reference",
      label: "Reference",
      format: (v) => <span className="text-[11px] font-mono" style={{ color: "#94A3B8" }}>{v as string}</span>,
    },
  ];

  return (
    <div>
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        {[
          { label: "Expected (Mar)", value: `AED ${stats.totalExpected.toLocaleString()}`, color: "#0F172A" },
          { label: "Collected (Mar)", value: `AED ${stats.totalCollected.toLocaleString()}`, color: "#0D9488" },
          { label: "Collection Rate", value: `${stats.collectionRate}%`, color: stats.collectionRate >= 90 ? "#22C55E" : "#F59E0B" },
          { label: "Outstanding", value: `AED ${stats.outstanding.toLocaleString()}`, color: "#F59E0B" },
          { label: "Vacancy Loss", value: `AED ${stats.vacancyLoss.toLocaleString()}`, color: "#EF4444" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl p-4" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}>
            <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#94A3B8" }}>{stat.label}</p>
            <p className="text-xl font-bold mt-1" style={{ color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Income chart */}
      <div className="mb-6">
        <IncomeChart />
      </div>

      {/* Payment history */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold" style={{ color: "#0F172A" }}>Payment History</h3>
        <button className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{ backgroundColor: "#0D948810", color: "#0D9488" }}>
          Export CSV
        </button>
      </div>

      <HavenDataTable<PaymentRecord>
        columns={columns}
        data={paymentRecords}
        rowKey={(r) => r.id}
        defaultSortKey="date"
        defaultSortDir="desc"
        pageSize={8}
      />
    </div>
  );
};

export default HavenFinancialsView;
