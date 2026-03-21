import React from "react";
import { motion } from "framer-motion";
import StatusPill from "../../shared/StatusPill";
import type { Order, OrderStatus } from "../arrow.data";

type TabId = "all" | OrderStatus;

interface TabDef {
  id: TabId;
  label: string;
}

const tabs: TabDef[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "delayed", label: "Delayed" },
  { id: "delivered", label: "Done" },
  { id: "failed", label: "Failed" },
  { id: "pending", label: "Pending" },
];

interface Props {
  orders: Order[];
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  selectedOrderId: string | null;
  onSelectOrder: (id: string) => void;
}

const ArrowOrderList: React.FC<Props> = ({
  orders,
  activeTab,
  onTabChange,
  selectedOrderId,
  onSelectOrder,
}) => {
  const filteredOrders = activeTab === "all"
    ? orders
    : orders.filter((o) => o.status === activeTab);

  const tabCounts: Record<TabId, number> = {
    all: orders.length,
    active: orders.filter((o) => o.status === "active").length,
    delayed: orders.filter((o) => o.status === "delayed").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    failed: orders.filter((o) => o.status === "failed").length,
    pending: orders.filter((o) => o.status === "pending").length,
  };

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      <div
        className="px-4 py-2 flex items-center gap-1 overflow-x-auto"
        style={{ borderBottom: "1px solid #E2E8F0" }}
      >
        {tabs.map((tab) => {
          const count = tabCounts[tab.id];
          if (count === 0 && tab.id !== "all") return null;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap"
              style={{
                backgroundColor: isActive ? "#F0FDF4" : "transparent",
                color: isActive ? "#166534" : "#64748B",
                border: isActive ? "1px solid #BBF7D0" : "1px solid transparent",
              }}
            >
              {tab.label}
              <span
                className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold"
                style={{
                  backgroundColor: isActive ? "#DCFCE7" : "#F1F5F9",
                  color: isActive ? "#166534" : "#94A3B8",
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Order list */}
      <div className="flex-1 overflow-y-auto">
        {filteredOrders.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-sm" style={{ color: "#94A3B8" }}>
              No orders found
            </p>
          </div>
        ) : (
          filteredOrders.map((order, i) => {
            const isSelected = selectedOrderId === order.id;
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03, duration: 0.25 }}
                onClick={() => onSelectOrder(order.id)}
                className="px-4 py-3 flex items-center gap-3 cursor-pointer transition-all duration-150"
                style={{
                  borderBottom: "1px solid #F1F5F9",
                  backgroundColor: isSelected ? "#F0FDF4" : "transparent",
                  borderLeft: isSelected ? "3px solid #22C55E" : "3px solid transparent",
                }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "#0F172A" }}
                    >
                      {order.orderNumber}
                    </span>
                    <StatusPill status={order.status} />
                  </div>
                  <p
                    className="text-xs mt-0.5 truncate"
                    style={{ color: "#64748B" }}
                  >
                    {order.customer}
                  </p>
                  <p
                    className="text-[10px] mt-0.5 truncate"
                    style={{ color: "#94A3B8" }}
                  >
                    {order.address}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p
                    className="text-xs font-semibold tabular-nums"
                    style={{ color: "#0F172A" }}
                  >
                    {order.total}
                  </p>
                  <p
                    className="text-[10px] tabular-nums"
                    style={{ color: "#94A3B8" }}
                  >
                    {order.deliveryWindow}
                  </p>
                  <p className="text-[10px] mt-0.5" style={{ color: "#CBD5E1" }}>
                    {order.items} item{order.items > 1 ? "s" : ""}
                  </p>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ArrowOrderList;
