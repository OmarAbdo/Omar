import React from "react";
import { motion } from "framer-motion";
import { advisor } from "../../vault.data";

const card = {
  backgroundColor: "#18181B",
  border: "1px solid rgba(255,255,255,0.04)",
};

const VaultAdvisorView: React.FC = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Advisor profile */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl p-6 text-center"
        style={{ ...card, borderColor: "rgba(201,169,110,0.1)" }}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-xl font-semibold mx-auto mb-4"
          style={{
            backgroundColor: "#C9A96E15",
            color: "#C9A96E",
            border: "2px solid #C9A96E30",
          }}
        >
          SC
        </div>
        <h3 className="text-lg font-semibold" style={{ color: "#FAFAF9", fontFamily: "'Playfair Display', serif" }}>
          {advisor.name}
        </h3>
        <p className="text-xs mt-1 mb-5" style={{ color: "#71717A" }}>{advisor.title}</p>

        <div className="space-y-3 text-left mb-6">
          {[
            { label: "Phone", value: advisor.phone },
            { label: "Email", value: advisor.email },
            { label: "Office", value: advisor.office },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: "#52524E" }}>
                {item.label}
              </p>
              <p className="text-xs" style={{ color: "#A1A1AA" }}>{item.value}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <button
            className="w-full py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 hover:scale-[1.02]"
            style={{ backgroundColor: "#C9A96E", color: "#09090B" }}
          >
            Schedule a Call
          </button>
          <button
            className="w-full py-2.5 rounded-xl text-xs font-medium transition-all duration-300 hover:scale-[1.02]"
            style={{ border: "1px solid #C9A96E30", color: "#C9A96E" }}
          >
            Send Message
          </button>
        </div>
      </motion.div>

      {/* Right column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Upcoming appointments */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="rounded-2xl p-6"
          style={card}
        >
          <h3 className="text-sm font-medium mb-4" style={{ color: "#FAFAF9" }}>Upcoming</h3>
          <div className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: "#C9A96E08", border: "1px solid #C9A96E15" }}>
            <div
              className="w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0"
              style={{ backgroundColor: "#C9A96E15" }}
            >
              <span className="text-xs font-bold" style={{ color: "#C9A96E" }}>28</span>
              <span className="text-[9px]" style={{ color: "#C9A96E80" }}>MAR</span>
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: "#FAFAF9" }}>Q1 Portfolio Review</p>
              <p className="text-xs" style={{ color: "#71717A" }}>
                {advisor.nextMeeting} · DIFC Office
              </p>
            </div>
            <div className="ml-auto">
              <span
                className="text-[10px] font-medium px-2.5 py-1 rounded-full"
                style={{ backgroundColor: "#3B82F615", color: "#3B82F6" }}
              >
                Confirmed
              </span>
            </div>
          </div>
        </motion.div>

        {/* Recent communications */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="rounded-2xl overflow-hidden"
          style={card}
        >
          <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <h3 className="text-sm font-medium" style={{ color: "#FAFAF9" }}>Recent Messages</h3>
          </div>
          {advisor.messages.map((msg, i) => (
            <div
              key={msg.id}
              className="px-6 py-4 transition-colors hover:bg-[#ffffff03] cursor-pointer"
              style={{
                borderBottom: i < advisor.messages.length - 1
                  ? "1px solid rgba(255,255,255,0.03)"
                  : "none",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-semibold shrink-0"
                    style={{ backgroundColor: "#C9A96E15", color: "#C9A96E" }}
                  >
                    SC
                  </div>
                  <span className="text-xs font-medium" style={{ color: "#FAFAF9" }}>{advisor.name}</span>
                </div>
                <span className="text-[10px]" style={{ color: "#52524E" }}>{msg.date}</span>
              </div>
              <p className="text-xs leading-relaxed pl-8" style={{ color: "#A1A1AA" }}>
                {msg.preview}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  </div>
);

export default VaultAdvisorView;
