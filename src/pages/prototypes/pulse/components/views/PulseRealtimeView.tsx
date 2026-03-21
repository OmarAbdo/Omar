import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MockChart from "../../../shared/MockChart";
import Sparkline from "../../../shared/Sparkline";
import { useInterval } from "../../hooks/useInterval";
import {
  realtimeInitialVisitors,
  realtimeInitialPageViews,
  realtimeEventPool,
  realtimeTopPages,
  type RealtimeEvent,
} from "../../pulse.data";

let eventIdCounter = 100;

const PulseRealtimeView: React.FC = () => {
  const [visitors, setVisitors] = useState(realtimeInitialVisitors);
  const [pageViews, setPageViews] = useState<number[]>(realtimeInitialPageViews);
  const [events, setEvents] = useState<RealtimeEvent[]>(() =>
    realtimeEventPool.slice(0, 8).map((e, i) => ({
      ...e,
      id: i,
      time: `${(i + 1) * 3}s ago`,
    }))
  );

  const addEvent = useCallback(() => {
    const pool = realtimeEventPool;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    const newEvent: RealtimeEvent = {
      ...pick,
      id: ++eventIdCounter,
      time: "Just now",
    };
    setEvents((prev) => {
      const updated = prev.map((e) => ({
        ...e,
        time: e.time === "Just now" ? "3s ago" : e.time.includes("s ago")
          ? `${parseInt(e.time) + 3}s ago`
          : e.time,
      }));
      return [newEvent, ...updated].slice(0, 15);
    });
  }, []);

  // Fluctuate visitor count
  useInterval(() => {
    setVisitors((v) => Math.max(180, v + Math.floor(Math.random() * 11) - 5));
  }, 2000);

  // Shift chart data
  useInterval(() => {
    setPageViews((prev) => {
      const next = [...prev.slice(1), Math.floor(Math.random() * 20) + 25];
      return next;
    });
  }, 3000);

  // Add new event
  useInterval(addEvent, 3500);

  const eventColors: Record<string, string> = {
    page_view: "#3B82F6",
    button_click: "#06B6D4",
    form_submit: "#10B981",
    purchase: "#F59E0B",
    scroll_depth_75: "#8B5CF6",
    video_play: "#EC4899",
    file_download: "#14B8A6",
    error: "#F43F5E",
  };

  return (
    <div>
      {/* Live visitor count */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl p-6 mb-4"
        style={{ backgroundColor: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
          </span>
          <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "#10B981" }}>
            Live
          </span>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-5xl font-bold font-mono tabular-nums" style={{ color: "#F1F5F9" }}>
            {visitors}
          </span>
          <span className="text-sm" style={{ color: "#64748B" }}>active visitors right now</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Pageviews per minute chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="xl:col-span-2 rounded-xl p-5"
          style={{ backgroundColor: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <h3 className="text-sm font-semibold mb-1" style={{ color: "#F1F5F9" }}>Pageviews per Minute</h3>
          <p className="text-xs mb-4" style={{ color: "#64748B" }}>Last 20 minutes</p>
          <div className="h-44">
            <MockChart data={pageViews} type="area" color="#10B981" secondaryColor="#10B981" gridColor="rgba(255,255,255,0.04)" />
          </div>
        </motion.div>

        {/* Active pages */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl p-5"
          style={{ backgroundColor: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <h3 className="text-sm font-semibold mb-4" style={{ color: "#F1F5F9" }}>Active Pages</h3>
          <div className="space-y-0">
            {realtimeTopPages.map((page, i) => (
              <div
                key={page.path}
                className="flex items-center justify-between py-2.5 transition-colors hover:bg-white/[0.02]"
                style={{ borderBottom: i < realtimeTopPages.length - 1 ? "1px solid rgba(255,255,255,0.04)" : undefined }}
              >
                <span className="text-sm font-mono" style={{ color: "#94A3B8" }}>{page.path}</span>
                <div className="flex items-center gap-2">
                  <Sparkline data={[page.activeUsers * 0.6, page.activeUsers * 0.8, page.activeUsers * 0.7, page.activeUsers * 0.9, page.activeUsers]} color="#3B82F6" width={40} height={16} />
                  <span className="text-sm font-mono font-medium" style={{ color: "#F1F5F9" }}>
                    {page.activeUsers}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Live activity feed */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="xl:col-span-3 rounded-xl p-5"
          style={{ backgroundColor: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <h3 className="text-sm font-semibold mb-4" style={{ color: "#F1F5F9" }}>Live Activity Feed</h3>
          <div className="space-y-0 max-h-80 overflow-y-auto">
            <AnimatePresence initial={false}>
              {events.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-4 py-2.5"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: eventColors[event.event] || "#64748B" }}
                  />
                  <span className="text-xs font-mono font-medium w-28 shrink-0" style={{ color: eventColors[event.event] || "#94A3B8" }}>
                    {event.event}
                  </span>
                  <span className="text-xs font-mono flex-1 truncate" style={{ color: "#94A3B8" }}>
                    {event.page}
                  </span>
                  <span className="text-sm shrink-0">{event.flag}</span>
                  <span className="text-xs shrink-0 w-16 text-right" style={{ color: "#64748B" }}>
                    {event.device}
                  </span>
                  <span className="text-xs font-mono shrink-0 w-16 text-right" style={{ color: "#64748B" }}>
                    {event.time}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PulseRealtimeView;
