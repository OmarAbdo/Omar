import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import StatusPill from "../../shared/StatusPill";
import type { Invoice } from "../safi.data";

interface Props {
  invoice: Invoice | null;
  onClose: () => void;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n);

const SafiInvoiceDetail: React.FC<Props> = ({ invoice, onClose }) => (
  <AnimatePresence>
    {invoice && (
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 40 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="rounded-xl overflow-hidden h-full flex flex-col"
        style={{ border: "1px solid #E5E5E5", backgroundColor: "#FFFFFF" }}
      >
        {/* Document header */}
        <div className="px-6 pt-6 pb-4 shrink-0" style={{ borderBottom: "1px solid #F5F5F5" }}>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight" style={{ color: "#171717" }}>
                INVOICE
              </h2>
              <p className="mt-0.5 text-sm font-semibold" style={{ color: "#4338CA" }}>
                {invoice.number}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <StatusPill status={invoice.status} size="md" />
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg transition-colors hover:bg-gray-100"
                style={{ color: "#A3A3A3" }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* From / To */}
          <div className="px-6 py-5 grid grid-cols-2 gap-6" style={{ borderBottom: "1px solid #F5F5F5" }}>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: "#A3A3A3" }}>
                From
              </p>
              <p className="text-sm font-semibold" style={{ color: "#171717" }}>
                Omar Abdo
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#737373" }}>
                Senior Software Developer
              </p>
              <p className="text-xs" style={{ color: "#737373" }}>
                Berlin, Germany
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: "#A3A3A3" }}>
                Bill To
              </p>
              <p className="text-sm font-semibold" style={{ color: "#171717" }}>
                {invoice.client}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#737373" }}>
                {invoice.email}
              </p>
            </div>
          </div>

          {/* Dates */}
          <div className="px-6 py-3.5 flex gap-8" style={{ borderBottom: "1px solid #F5F5F5" }}>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "#A3A3A3" }}>
                Issued
              </p>
              <p className="text-sm font-medium" style={{ color: "#171717" }}>{invoice.date}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "#A3A3A3" }}>
                Due
              </p>
              <p className="text-sm font-medium" style={{ color: "#171717" }}>{invoice.dueDate}</p>
            </div>
            {invoice.paymentDate && (
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "#A3A3A3" }}>
                  Paid
                </p>
                <p className="text-sm font-medium" style={{ color: "#10B981" }}>{invoice.paymentDate}</p>
              </div>
            )}
          </div>

          {/* Line items */}
          <div className="px-6 py-5">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid #E5E5E5" }}>
                  <th className="text-left text-[10px] font-semibold uppercase tracking-widest pb-2.5" style={{ color: "#A3A3A3" }}>
                    Description
                  </th>
                  <th className="text-center text-[10px] font-semibold uppercase tracking-widest pb-2.5 w-12" style={{ color: "#A3A3A3" }}>
                    Qty
                  </th>
                  <th className="text-right text-[10px] font-semibold uppercase tracking-widest pb-2.5 w-20" style={{ color: "#A3A3A3" }}>
                    Rate
                  </th>
                  <th className="text-right text-[10px] font-semibold uppercase tracking-widest pb-2.5 w-20" style={{ color: "#A3A3A3" }}>
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #F5F5F5" }}>
                    <td className="py-2.5 text-sm" style={{ color: "#171717" }}>
                      {item.description}
                    </td>
                    <td className="py-2.5 text-sm text-center tabular-nums" style={{ color: "#737373" }}>
                      {item.qty}
                    </td>
                    <td className="py-2.5 text-sm text-right tabular-nums" style={{ color: "#737373" }}>
                      {fmt(item.rate)}
                    </td>
                    <td className="py-2.5 text-sm text-right font-medium tabular-nums" style={{ color: "#171717" }}>
                      {fmt(item.qty * item.rate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div className="px-6 pb-5">
            <div className="flex items-center justify-between pt-3" style={{ borderTop: "2px solid #E5E5E5" }}>
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#737373" }}>
                Total Due
              </span>
              <span
                className="text-xl font-bold tabular-nums"
                style={{
                  color: "#171717",
                  borderBottom: "2px solid #C9A96E",
                  paddingBottom: "2px",
                }}
              >
                {fmt(invoice.amount)}
              </span>
            </div>
          </div>

          {/* Payment info (for paid invoices) */}
          {invoice.paymentDate && invoice.paymentMethod && (
            <div className="px-6 pb-5">
              <div
                className="rounded-lg p-4"
                style={{ backgroundColor: "#10B98108", border: "1px solid #10B98120" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#10B981" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs font-semibold" style={{ color: "#10B981" }}>
                    Payment Received
                  </span>
                </div>
                <div className="flex gap-6 text-xs" style={{ color: "#525252" }}>
                  <div>
                    <span style={{ color: "#A3A3A3" }}>Method: </span>
                    {invoice.paymentMethod}
                  </div>
                  <div>
                    <span style={{ color: "#A3A3A3" }}>Date: </span>
                    {invoice.paymentDate}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {invoice.notes && (
            <div className="px-6 pb-5">
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#A3A3A3" }}>
                Notes
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "#525252" }}>
                {invoice.notes}
              </p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="px-6 py-4 flex gap-2 shrink-0" style={{ borderTop: "1px solid #E5E5E5" }}>
          {invoice.status === "overdue" && (
            <button
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors duration-150"
              style={{ backgroundColor: "#F59E0B15", color: "#D97706", border: "1px solid #F59E0B30" }}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              Send Reminder
            </button>
          )}
          {invoice.status !== "paid" && (
            <button
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors duration-150"
              style={{ backgroundColor: "#10B98115", color: "#059669", border: "1px solid #10B98130" }}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Mark Paid
            </button>
          )}
          <button
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors duration-150"
            style={{ backgroundColor: "#FAFAFA", color: "#525252", border: "1px solid #E5E5E5" }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            PDF
          </button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default SafiInvoiceDetail;
