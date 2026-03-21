import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import PrototypeShell from "../shared/PrototypeShell";
import ArrowHeader from "./components/ArrowHeader";
import ArrowStatsBar from "./components/ArrowStatsBar";
import ArrowDriverRow from "./components/ArrowDriverRow";
import ArrowOrderList from "./components/ArrowOrderList";
import ArrowMapArea from "./components/ArrowMapArea";
import ArrowOrderDetail from "./components/ArrowOrderDetail";
import ArrowActivityFeed from "./components/ArrowActivityFeed";
import {
  orders as allOrders,
  drivers as allDrivers,
  activityFeed,
  stats,
} from "./arrow.data";
import type { Zone, OrderStatus } from "./arrow.data";

type TabId = "all" | OrderStatus;

const ArrowPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeZone, setActiveZone] = useState<Zone>("all");
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("all");

  // Filter orders by zone, driver, and search
  const filteredOrders = useMemo(() => {
    let result = allOrders;

    if (activeZone !== "all") {
      result = result.filter((o) => o.zone === activeZone);
    }

    if (selectedDriverId) {
      result = result.filter((o) => o.driverId === selectedDriverId);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customer.toLowerCase().includes(q) ||
          o.address.toLowerCase().includes(q)
      );
    }

    return result;
  }, [activeZone, selectedDriverId, searchQuery]);

  // Filter drivers by zone and search
  const filteredDrivers = useMemo(() => {
    let result = allDrivers;

    if (activeZone !== "all") {
      result = result.filter((d) => d.zone === activeZone);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.vehicle.toLowerCase().includes(q)
      );
    }

    return result;
  }, [activeZone, searchQuery]);

  const selectedOrder = allOrders.find((o) => o.id === selectedOrderId) || null;
  const activeCount = allOrders.filter((o) => o.status === "active").length;

  const handleSelectDriver = (id: string | null) => {
    setSelectedDriverId(id);
    setSelectedOrderId(null);
  };

  const handleSelectOrder = (id: string) => {
    setSelectedOrderId(id === selectedOrderId ? null : id);
  };

  const statsItems = [
    { label: "Total", value: stats.totalOrders, color: "#0F172A" },
    { label: "Active", value: stats.active, color: "#22C55E", total: stats.totalOrders },
    { label: "Done", value: stats.delivered, color: "#3B82F6", total: stats.totalOrders },
    { label: "Late", value: stats.delayed, color: "#F59E0B", total: stats.totalOrders },
    { label: "Rate", value: `${stats.completionRate}%`, color: "#8B5CF6" },
  ];

  return (
    <PrototypeShell
      bgColor="#FFFFFF"
      textColor="#0F172A"
      accentColor="#22C55E"
      title="Arrow"
    >
      <div className="flex flex-col h-screen">
        {/* Top header */}
        <ArrowHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeZone={activeZone}
          onZoneChange={setActiveZone}
          activeCount={activeCount}
        />

        <div className="flex flex-1 overflow-hidden">
          {/* Left panel — drivers + orders + activity */}
          <div
            className="w-[400px] shrink-0 flex flex-col overflow-hidden"
            style={{ borderRight: "1px solid #E2E8F0" }}
          >
            {/* Brand header */}
            <div className="px-4 py-3 flex items-center gap-3" style={{ borderBottom: "1px solid #E2E8F0" }}>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#F0FDF4" }}
              >
                <svg className="w-4 h-4" style={{ color: "#22C55E" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </div>
              <div>
                <h1 className="text-sm font-bold" style={{ color: "#0F172A" }}>
                  Arrow
                </h1>
                <p className="text-[10px]" style={{ color: "#94A3B8" }}>
                  Every drop. On the dot.
                </p>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: "#F1F5F9", color: "#64748B" }}>
                  {stats.avgDeliveryTime} avg
                </span>
              </div>
            </div>

            {/* Stats */}
            <ArrowStatsBar stats={statsItems} />

            {/* Drivers */}
            <ArrowDriverRow
              drivers={filteredDrivers}
              selectedDriverId={selectedDriverId}
              onSelectDriver={handleSelectDriver}
            />

            {/* Orders */}
            <div className="flex-1 overflow-hidden flex flex-col">
              <ArrowOrderList
                orders={filteredOrders}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                selectedOrderId={selectedOrderId}
                onSelectOrder={handleSelectOrder}
              />
            </div>

            {/* Activity Feed */}
            <ArrowActivityFeed events={activityFeed} />
          </div>

          {/* Right panel — map */}
          <main className="flex-1 p-3 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="h-full"
            >
              <ArrowMapArea
                drivers={allDrivers}
                orders={allOrders}
                selectedDriverId={selectedDriverId}
                selectedOrderId={selectedOrderId}
                activeZone={activeZone}
                onSelectDriver={handleSelectDriver}
              />
            </motion.div>
          </main>
        </div>
      </div>

      {/* Order detail slide-in */}
      <ArrowOrderDetail
        order={selectedOrder}
        onClose={() => setSelectedOrderId(null)}
      />
    </PrototypeShell>
  );
};

export default ArrowPage;
