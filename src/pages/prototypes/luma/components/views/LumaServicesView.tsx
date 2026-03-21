import React from "react";
import { motion } from "framer-motion";
import { services } from "../../luma.data";

const LumaServicesView: React.FC = () => {
  const activeCount = services.filter((s) => s.active).length;
  const avgDuration = services.reduce((sum, s) => sum + s.duration, 0) / services.length;
  const avgPrice = Math.round(services.reduce((sum, s) => sum + s.price, 0) / services.length);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-5">
      {/* Stats */}
      <div className="flex gap-4 mb-6">
        {[
          { label: "Total Services", value: services.length },
          { label: "Active", value: activeCount },
          { label: "Avg Duration", value: `${avgDuration.toFixed(1)}h` },
          { label: "Avg Price", value: `$${avgPrice}` },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl px-4 py-3"
            style={{ backgroundColor: "#FFF7ED", border: "1px solid #F5E6D3" }}
          >
            <p className="text-lg font-bold" style={{ color: "#292524", fontFamily: "'DM Sans', sans-serif" }}>{s.value}</p>
            <p className="text-[10px]" style={{ color: "#A8A29E", fontFamily: "'DM Sans', sans-serif" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Service cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {services.map((service, i) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="rounded-2xl p-5 relative overflow-hidden transition-shadow duration-200 hover:shadow-md"
            style={{
              backgroundColor: "#FFFBF7",
              border: "1px solid #F5E6D3",
              opacity: service.active ? 1 : 0.55,
            }}
          >
            {/* Color indicator */}
            <div
              className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
              style={{ backgroundColor: service.color }}
            />

            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: service.color }}
                />
                <h3 className="text-sm font-bold" style={{ color: "#292524", fontFamily: "'DM Sans', sans-serif" }}>
                  {service.name}
                </h3>
              </div>
              {/* Active toggle */}
              <button
                className="w-9 h-5 rounded-full relative transition-colors duration-200"
                style={{
                  backgroundColor: service.active ? "#C2703E" : "#E7E5E4",
                }}
              >
                <div
                  className="w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-all duration-200"
                  style={{
                    left: service.active ? 20 : 3,
                  }}
                />
              </button>
            </div>

            <p className="text-xs leading-relaxed mb-4" style={{ color: "#78716C", fontFamily: "'DM Sans', sans-serif" }}>
              {service.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" style={{ color: "#A8A29E" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs font-medium" style={{ color: "#78716C" }}>{service.duration}h</span>
                </div>
              </div>
              <span className="text-base font-bold" style={{ color: "#292524", fontFamily: "'DM Sans', sans-serif" }}>
                ${service.price}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LumaServicesView;
