import React from "react";
import PrototypeShell from "../shared/PrototypeShell";
import { usePulseState } from "./hooks/usePulseState";
import PulseSidebar from "./components/PulseSidebar";
import PulseHeader from "./components/PulseHeader";
import PulseOverviewView from "./components/views/PulseOverviewView";
import PulseRealtimeView from "./components/views/PulseRealtimeView";
import PulseAudienceView from "./components/views/PulseAudienceView";
import PulseAcquisitionView from "./components/views/PulseAcquisitionView";
import PulseEventsView from "./components/views/PulseEventsView";
import PulseSettingsView from "./components/views/PulseSettingsView";

const FONT_LINKS = [
  "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap",
];

const PulsePage: React.FC = () => {
  const state = usePulseState();

  const renderView = () => {
    switch (state.activeView) {
      case "overview": return <PulseOverviewView state={state} />;
      case "realtime": return <PulseRealtimeView />;
      case "audience": return <PulseAudienceView />;
      case "acquisition": return <PulseAcquisitionView />;
      case "events": return <PulseEventsView />;
      case "settings": return <PulseSettingsView />;
    }
  };

  return (
    <PrototypeShell
      bgColor="#0B1120"
      textColor="#F1F5F9"
      accentColor="#3B82F6"
      fontLinks={FONT_LINKS}
      title="Pulse"
    >
      <div className="flex h-screen overflow-hidden">
        <PulseSidebar
          activeView={state.activeView}
          onViewChange={state.setActiveView}
          collapsed={state.sidebarCollapsed}
          onToggleCollapse={() => state.setSidebarCollapsed(!state.sidebarCollapsed)}
          notificationsOpen={state.notificationsOpen}
          onToggleNotifications={() => state.setNotificationsOpen(!state.notificationsOpen)}
          onToggleSearch={() => state.setSearchOpen(!state.searchOpen)}
        />
        <main className="flex-1 p-6 pb-16 overflow-y-auto">
          <PulseHeader state={state} />
          {renderView()}
        </main>
      </div>
    </PrototypeShell>
  );
};

export default PulsePage;
