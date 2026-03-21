import React, { useState } from "react";
import SafiSidebar from "./components/SafiSidebar";
import SafiTopBar from "./components/SafiTopBar";
import SafiDashboardView from "./components/SafiDashboardView";
import SafiInvoicesView from "./components/SafiInvoicesView";
import SafiClientsView from "./components/SafiClientsView";
import SafiReportsView from "./components/SafiReportsView";
import SafiSettingsView from "./components/SafiSettingsView";
import SafiNewInvoiceModal from "./components/SafiNewInvoiceModal";
import type { SafiView } from "./components/SafiSidebar";

const SafiPage: React.FC = () => {
  const [activeView, setActiveView] = useState<SafiView>("dashboard");
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <SafiDashboardView />;
      case "invoices":
        return <SafiInvoicesView />;
      case "clients":
        return <SafiClientsView />;
      case "reports":
        return <SafiReportsView />;
      case "settings":
        return <SafiSettingsView />;
      default:
        return <SafiDashboardView />;
    }
  };

  return (
    <div className="h-screen w-full flex overflow-hidden" style={{ backgroundColor: "#FFFFFF", color: "#171717" }}>
      {/* Sidebar */}
      <SafiSidebar
        activeView={activeView}
        onNavigate={setActiveView}
        onNewInvoice={() => setIsNewInvoiceOpen(true)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <SafiTopBar activeView={activeView} />
        <main className="flex-1 overflow-y-auto">
          {renderView()}
        </main>
      </div>

      {/* New Invoice Modal */}
      <SafiNewInvoiceModal
        isOpen={isNewInvoiceOpen}
        onClose={() => setIsNewInvoiceOpen(false)}
      />
    </div>
  );
};

export default SafiPage;
