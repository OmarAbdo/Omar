import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PrototypeShell from "../shared/PrototypeShell";
import LumaSidebar from "./components/LumaSidebar";
import LumaHeader from "./components/LumaHeader";
import LumaNewBookingModal from "./components/LumaNewBookingModal";
import LumaScheduleView from "./components/views/LumaScheduleView";
import LumaClientsView from "./components/views/LumaClientsView";
import LumaServicesView from "./components/views/LumaServicesView";
import LumaActivityView from "./components/views/LumaActivityView";
import LumaSettingsView from "./components/views/LumaSettingsView";
import type { LumaViewId } from "./luma.data";

const FONT_LINKS = [
  "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap",
];

const LumaPage: React.FC = () => {
  const [activeView, setActiveView] = useState<LumaViewId>("schedule");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  return (
    <PrototypeShell
      bgColor="#FFFBF7"
      textColor="#292524"
      accentColor="#C2703E"
      fontLinks={FONT_LINKS}
      title="Luma"
    >
      <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {/* Sidebar */}
        <LumaSidebar
          activeView={activeView}
          onChangeView={setActiveView}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Main area */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Header */}
          <LumaHeader
            activeView={activeView}
            onNewBooking={() => setBookingModalOpen(true)}
          />

          {/* View content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex min-h-0 overflow-hidden"
            >
              {activeView === "schedule" && <LumaScheduleView />}
              {activeView === "clients" && <LumaClientsView />}
              {activeView === "services" && <LumaServicesView />}
              {activeView === "activity" && <LumaActivityView />}
              {activeView === "settings" && <LumaSettingsView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* New Booking Modal */}
      <LumaNewBookingModal
        open={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
      />
    </PrototypeShell>
  );
};

export default LumaPage;
