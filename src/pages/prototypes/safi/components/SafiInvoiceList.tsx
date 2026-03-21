import React from "react";
import { motion } from "framer-motion";
import StatusPill from "../../shared/StatusPill";
import type { Invoice } from "../safi.data";

interface Props {
  invoices: Invoice[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const SafiInvoiceList: React.FC<Props> = ({ invoices, selectedId, onSelect }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.3 }}
    className="rounded-xl overflow-hidden"
    style={{ border: "1px solid #E5E5E5" }}
  >
    <div className="px-5 py-4" style={{ backgroundColor: "#FAFAFA", borderBottom: "1px solid #E5E5E5" }}>
      <h3 className="text-sm font-semibold" style={{ color: "#171717" }}>
        Recent Invoices
      </h3>
    </div>
    <div style={{ backgroundColor: "#FFFFFF" }}>
      {invoices.map((inv, i) => (
        <button
          key={inv.id}
          onClick={() => onSelect(inv.id)}
          className="w-full text-left px-5 py-4 flex items-center gap-4 transition-colors duration-150 hover:bg-[#FAFAFA]"
          style={{
            borderBottom: i < invoices.length - 1 ? "1px solid #F5F5F5" : undefined,
            backgroundColor: selectedId === inv.id ? "#F0F0FF" : undefined,
          }}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold" style={{ color: "#171717" }}>
                {inv.number}
              </span>
              <StatusPill status={inv.status} />
            </div>
            <p className="mt-1 text-sm truncate" style={{ color: "#737373" }}>
              {inv.client}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-bold" style={{ color: "#171717" }}>
              {fmt(inv.amount)}
            </p>
            <p className="text-xs" style={{ color: "#A3A3A3" }}>
              Due {inv.dueDate}
            </p>
          </div>
        </button>
      ))}
    </div>
  </motion.div>
);

export default SafiInvoiceList;
