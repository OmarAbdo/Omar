import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import PrototypeShell from "../shared/PrototypeShell";
import HavenSidebar from "./components/HavenSidebar";
import HavenHeader from "./components/HavenHeader";
import HavenTenantPanel from "./components/HavenTenantPanel";
import HavenUnitsView from "./components/views/HavenUnitsView";
import HavenTenantsView from "./components/views/HavenTenantsView";
import HavenFinancialsView from "./components/views/HavenFinancialsView";
import HavenMaintenanceView from "./components/views/HavenMaintenanceView";
import HavenDocumentsView from "./components/views/HavenDocumentsView";
import HavenSettingsView from "./components/views/HavenSettingsView";
import { properties } from "./haven.data";
import { useHavenState } from "./hooks/useHavenState";

const HavenPage: React.FC = () => {
  const state = useHavenState();

  const selectedUnit = state.currentProperty.units.find((u) => u.id === state.selectedUnitId) || null;
  const showTenantPanel = state.activeView === "units" && selectedUnit !== null;

  return (
    <PrototypeShell
      bgColor="#F8FAFC"
      textColor="#0F172A"
      accentColor="#0D9488"
      title="Haven"
    >
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <HavenSidebar
          properties={properties}
          selectedPropertyId={state.selectedPropertyId}
          onSelectProperty={state.setSelectedPropertyId}
          activeView={state.activeView}
          onSelectView={state.setActiveView}
          collapsed={state.sidebarCollapsed}
          onToggleCollapse={() => state.setSidebarCollapsed(!state.sidebarCollapsed)}
          notificationsOpen={state.notificationsOpen}
          onToggleNotifications={() => state.setNotificationsOpen(!state.notificationsOpen)}
        />

        {/* Main content */}
        <main className="flex-1 p-6 overflow-y-auto min-w-0" style={{ backgroundColor: "#F8FAFC" }}>
          <HavenHeader activeView={state.activeView} currentProperty={state.currentProperty}>
            {state.activeView === "units" && (
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium shrink-0"
                style={{ backgroundColor: "#0D9488", color: "#FFFFFF" }}
              >
                Add Unit
              </button>
            )}
          </HavenHeader>

          <AnimatePresence mode="wait">
            <motion.div
              key={state.activeView}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {state.activeView === "units" && (
                <HavenUnitsView
                  units={state.filteredUnits}
                  allUnits={state.currentProperty.units}
                  selectedUnitId={state.selectedUnitId}
                  onSelectUnit={state.setSelectedUnitId}
                  statusFilter={state.statusFilter}
                  onSetStatusFilter={state.setStatusFilter}
                  viewMode={state.unitViewMode}
                  onSetViewMode={state.setUnitViewMode}
                  searchQuery={state.searchQuery}
                  onSetSearchQuery={state.setSearchQuery}
                  stats={state.stats}
                />
              )}
              {state.activeView === "tenants" && <HavenTenantsView />}
              {state.activeView === "financials" && <HavenFinancialsView />}
              {state.activeView === "maintenance" && <HavenMaintenanceView />}
              {state.activeView === "documents" && <HavenDocumentsView />}
              {state.activeView === "settings" && <HavenSettingsView currentPropertyId={state.selectedPropertyId} />}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Tenant detail panel (units view only) */}
        {showTenantPanel && (
          <HavenTenantPanel unit={selectedUnit} onClose={() => state.setSelectedUnitId(null)} />
        )}
      </div>
    </PrototypeShell>
  );
};

export default HavenPage;
