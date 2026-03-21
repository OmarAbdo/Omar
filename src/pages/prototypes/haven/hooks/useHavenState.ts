import { useState, useMemo } from "react";
import type { HavenView, Unit, Property } from "../haven.data";
import { properties } from "../haven.data";

export type StatusFilter = "all" | "occupied" | "overdue" | "vacant";
export type UnitViewMode = "grid" | "list";
export type MaintenanceStatusFilter = "all" | "open" | "in_progress" | "resolved" | "cancelled";
export type DocumentTypeFilter = "all" | "lease" | "ejari" | "trade_license" | "insurance" | "noc" | "id_copy";

export interface HavenState {
  // Navigation
  activeView: HavenView;
  setActiveView: (view: HavenView) => void;

  // Property selection
  selectedPropertyId: string;
  setSelectedPropertyId: (id: string) => void;
  currentProperty: Property;

  // Unit selection & filtering
  selectedUnitId: string | null;
  setSelectedUnitId: (id: string | null) => void;
  statusFilter: StatusFilter;
  setStatusFilter: (f: StatusFilter) => void;
  unitViewMode: UnitViewMode;
  setUnitViewMode: (m: UnitViewMode) => void;
  filteredUnits: Unit[];

  // Sidebar
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (c: boolean) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Notifications
  notificationsOpen: boolean;
  setNotificationsOpen: (o: boolean) => void;

  // Maintenance
  selectedMaintenanceId: string | null;
  setSelectedMaintenanceId: (id: string | null) => void;
  maintenanceStatusFilter: MaintenanceStatusFilter;
  setMaintenanceStatusFilter: (f: MaintenanceStatusFilter) => void;

  // Documents
  documentTypeFilter: DocumentTypeFilter;
  setDocumentTypeFilter: (f: DocumentTypeFilter) => void;

  // Tenant panel tab
  tenantPanelTab: "details" | "payments" | "maintenance" | "documents";
  setTenantPanelTab: (t: "details" | "payments" | "maintenance" | "documents") => void;

  // Computed stats
  stats: {
    totalRent: number;
    occupied: number;
    overdue: number;
    vacant: number;
    occupancyRate: number;
  };
}

export function useHavenState(): HavenState {
  const [activeView, setActiveView] = useState<HavenView>("units");
  const [selectedPropertyId, setSelectedPropertyId] = useState(properties[0].id);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [unitViewMode, setUnitViewMode] = useState<UnitViewMode>("grid");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [selectedMaintenanceId, setSelectedMaintenanceId] = useState<string | null>(null);
  const [maintenanceStatusFilter, setMaintenanceStatusFilter] = useState<MaintenanceStatusFilter>("all");
  const [documentTypeFilter, setDocumentTypeFilter] = useState<DocumentTypeFilter>("all");
  const [tenantPanelTab, setTenantPanelTab] = useState<"details" | "payments" | "maintenance" | "documents">("details");

  const currentProperty = useMemo(
    () => properties.find((p) => p.id === selectedPropertyId) || properties[0],
    [selectedPropertyId],
  );

  const filteredUnits = useMemo(() => {
    let units = currentProperty.units;
    if (statusFilter !== "all") {
      units = units.filter((u) => u.status === statusFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      units = units.filter(
        (u) =>
          u.label.toLowerCase().includes(q) ||
          u.type.toLowerCase().includes(q) ||
          u.tenant?.name.toLowerCase().includes(q),
      );
    }
    return units;
  }, [currentProperty, statusFilter, searchQuery]);

  const stats = useMemo(() => {
    const units = currentProperty.units;
    const occupied = units.filter((u) => u.status === "occupied").length;
    const overdue = units.filter((u) => u.status === "overdue").length;
    const vacant = units.filter((u) => u.status === "vacant").length;
    const totalRent = units
      .filter((u) => u.status !== "vacant")
      .reduce((sum, u) => sum + u.monthlyRent, 0);
    const occupancyRate = units.length > 0 ? Math.round(((occupied + overdue) / units.length) * 100) : 0;
    return { totalRent, occupied, overdue, vacant, occupancyRate };
  }, [currentProperty]);

  return {
    activeView, setActiveView,
    selectedPropertyId,
    setSelectedPropertyId: (id: string) => {
      setSelectedPropertyId(id);
      setSelectedUnitId(null);
      setStatusFilter("all");
      setSearchQuery("");
    },
    currentProperty,
    selectedUnitId, setSelectedUnitId,
    statusFilter, setStatusFilter,
    unitViewMode, setUnitViewMode,
    filteredUnits,
    sidebarCollapsed, setSidebarCollapsed,
    searchQuery, setSearchQuery,
    notificationsOpen, setNotificationsOpen,
    selectedMaintenanceId, setSelectedMaintenanceId,
    maintenanceStatusFilter, setMaintenanceStatusFilter,
    documentTypeFilter, setDocumentTypeFilter,
    tenantPanelTab, setTenantPanelTab,
    stats,
  };
}
