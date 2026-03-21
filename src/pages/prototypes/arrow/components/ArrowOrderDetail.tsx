import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import StatusPill from "../../shared/StatusPill";
import type { Order } from "../arrow.data";
import { drivers } from "../arrow.data";

interface Props {
  order: Order | null;
  onClose: () => void;
}

const ArrowOrderDetail: React.FC<Props> = ({ order, onClose }) => {
  const driver = order ? drivers.find((d) => d.id === order.driverId) : null;

  return (
    <AnimatePresence>
      {order && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
            style={{ backgroundColor: "rgba(0,0,0,0.15)" }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-[420px] z-50 overflow-y-auto shadow-xl"
            style={{ backgroundColor: "#FFFFFF", borderLeft: "1px solid #E2E8F0" }}
          >
            {/* Header */}
            <div
              className="sticky top-0 px-6 py-4 flex items-center justify-between"
              style={{ backgroundColor: "#FFFFFF", borderBottom: "1px solid #E2E8F0" }}
            >
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold" style={{ color: "#0F172A" }}>
                    {order.orderNumber}
                  </h2>
                  <StatusPill status={order.status} />
                </div>
                <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
                  {order.deliveryWindow}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#F1F5F9] transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  style={{ color: "#64748B" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-5 space-y-6">
              {/* Customer */}
              <section>
                <h4
                  className="text-[10px] font-semibold uppercase tracking-wider mb-3"
                  style={{ color: "#94A3B8" }}
                >
                  Customer
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium" style={{ color: "#0F172A" }}>
                      {order.customer}
                    </span>
                    <span className="text-sm font-semibold" style={{ color: "#0F172A" }}>
                      {order.total}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: "#64748B" }}>
                    {order.address}
                  </p>
                  <p className="text-xs" style={{ color: "#64748B" }}>
                    {order.phone}
                  </p>
                  <p className="text-xs" style={{ color: "#94A3B8" }}>
                    {order.items} item{order.items > 1 ? "s" : ""}
                  </p>
                </div>
              </section>

              {/* Driver */}
              {driver && (
                <section>
                  <h4
                    className="text-[10px] font-semibold uppercase tracking-wider mb-3"
                    style={{ color: "#94A3B8" }}
                  >
                    Driver
                  </h4>
                  <div
                    className="flex items-center gap-3 p-3 rounded-lg"
                    style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: "#E2E8F0", color: "#475569" }}
                    >
                      {driver.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: "#0F172A" }}>
                        {driver.name}
                      </p>
                      <p className="text-xs" style={{ color: "#94A3B8" }}>
                        {driver.vehicle}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium" style={{ color: "#0F172A" }}>
                        ★ {driver.rating}
                      </p>
                      {driver.eta && (
                        <p className="text-[10px]" style={{ color: "#22C55E" }}>
                          ETA {driver.eta}
                        </p>
                      )}
                    </div>
                  </div>
                </section>
              )}

              {/* Notes */}
              {order.notes && (
                <section>
                  <h4
                    className="text-[10px] font-semibold uppercase tracking-wider mb-2"
                    style={{ color: "#94A3B8" }}
                  >
                    Notes
                  </h4>
                  <p
                    className="text-xs p-3 rounded-lg"
                    style={{
                      color: "#64748B",
                      backgroundColor: "#FFFBEB",
                      border: "1px solid #FDE68A",
                    }}
                  >
                    {order.notes}
                  </p>
                </section>
              )}

              {/* Timeline */}
              <section>
                <h4
                  className="text-[10px] font-semibold uppercase tracking-wider mb-4"
                  style={{ color: "#94A3B8" }}
                >
                  Timeline
                </h4>
                <div className="relative pl-6">
                  {/* Vertical line */}
                  <div
                    className="absolute left-[7px] top-1 bottom-1 w-px"
                    style={{ backgroundColor: "#E2E8F0" }}
                  />

                  <div className="space-y-4">
                    {order.timeline.map((step, i) => {
                      const isLast = i === order.timeline.length - 1;
                      const isFailed = step.event.toLowerCase().includes("failed");
                      const dotColor = step.done
                        ? isFailed
                          ? "#EF4444"
                          : "#22C55E"
                        : "#CBD5E1";

                      return (
                        <motion.div
                          key={step.event}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + i * 0.08, duration: 0.3 }}
                          className="relative flex items-start gap-3"
                        >
                          {/* Dot */}
                          <div className="absolute -left-6 mt-0.5">
                            <span
                              className="w-3.5 h-3.5 rounded-full flex items-center justify-center"
                              style={{
                                backgroundColor: dotColor,
                                border: step.done ? "none" : "2px solid #CBD5E1",
                              }}
                            >
                              {step.done && !isFailed && (
                                <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                              {isFailed && (
                                <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              )}
                            </span>
                            {/* Pulse on current step */}
                            {step.done && !isLast && !order.timeline[i + 1]?.done && (
                              <span
                                className="absolute inset-0 w-3.5 h-3.5 rounded-full animate-ping"
                                style={{ backgroundColor: "#22C55E", opacity: 0.3 }}
                              />
                            )}
                          </div>

                          <div className="flex-1 flex items-center justify-between">
                            <span
                              className="text-sm font-medium"
                              style={{ color: step.done ? "#0F172A" : "#CBD5E1" }}
                            >
                              {step.event}
                            </span>
                            <span
                              className="text-xs tabular-nums"
                              style={{ color: step.done ? "#64748B" : "#CBD5E1" }}
                            >
                              {step.time}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ArrowOrderDetail;
