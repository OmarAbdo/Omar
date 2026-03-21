import React from "react";
import PrototypeShell from "../shared/PrototypeShell";
import VaultSidebar from "./components/VaultSidebar";
import VaultTopBar from "./components/VaultTopBar";
import VaultDashboardView from "./components/views/VaultDashboardView";
import VaultPortfolioView from "./components/views/VaultPortfolioView";
import VaultTransactionsView from "./components/views/VaultTransactionsView";
import VaultAccountsView from "./components/views/VaultAccountsView";
import VaultCardsView from "./components/views/VaultCardsView";
import VaultTransfersView from "./components/views/VaultTransfersView";
import VaultInsightsView from "./components/views/VaultInsightsView";
import VaultAdvisorView from "./components/views/VaultAdvisorView";
import VaultSettingsView from "./components/views/VaultSettingsView";
import { useVaultState } from "./hooks/useVaultState";

const FONT_LINKS = [
  "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap",
];

const VaultPage: React.FC = () => {
  const state = useVaultState();

  const renderView = () => {
    switch (state.activeView) {
      case "dashboard":
        return <VaultDashboardView onNavigate={state.setActiveView} />;
      case "portfolio":
        return (
          <VaultPortfolioView
            showBenchmark={state.showBenchmark}
            onToggleBenchmark={() => state.setShowBenchmark(!state.showBenchmark)}
            performancePeriod={state.performancePeriod}
            onSetPeriod={state.setPerformancePeriod}
          />
        );
      case "transactions":
        return (
          <VaultTransactionsView
            filter={state.transactionFilter}
            search={state.transactionSearch}
            page={state.transactionPage}
            onFilterChange={state.setTransactionFilter}
            onSearchChange={state.setTransactionSearch}
            onPageChange={state.setTransactionPage}
          />
        );
      case "accounts":
        return <VaultAccountsView />;
      case "cards":
        return <VaultCardsView />;
      case "transfers":
        return <VaultTransfersView />;
      case "insights":
        return <VaultInsightsView />;
      case "advisor":
        return <VaultAdvisorView />;
      case "settings":
        return <VaultSettingsView />;
      default:
        return <VaultDashboardView onNavigate={state.setActiveView} />;
    }
  };

  return (
    <PrototypeShell
      bgColor="#09090B"
      textColor="#FAFAF9"
      accentColor="#C9A96E"
      fontLinks={FONT_LINKS}
      title="Vault"
    >
      <VaultSidebar
        activeView={state.activeView}
        collapsed={state.sidebarCollapsed}
        onNavigate={state.setActiveView}
        onToggleCollapse={() => state.setSidebarCollapsed(!state.sidebarCollapsed)}
      />

      {/* Main content area */}
      <div
        className="h-screen overflow-y-auto transition-all duration-300"
        style={{ marginLeft: state.sidebarCollapsed ? 72 : 240 }}
      >
        <div className="max-w-6xl mx-auto px-8 py-8 pb-20">
          <VaultTopBar activeView={state.activeView} />
          {renderView()}
        </div>
      </div>
    </PrototypeShell>
  );
};

export default VaultPage;
