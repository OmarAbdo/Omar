import React from "react";
import type { HavenView, Property } from "../haven.data";

const viewLabels: Record<HavenView, string> = {
  units: "Units",
  tenants: "Tenants",
  financials: "Financials",
  maintenance: "Maintenance",
  documents: "Documents",
  settings: "Settings",
};

const viewDescriptions: Record<HavenView, string> = {
  units: "Manage units, occupancy, and tenant assignments",
  tenants: "Directory of all tenants across properties",
  financials: "Income tracking, payments, and collection rates",
  maintenance: "Track and manage maintenance requests",
  documents: "Leases, Ejari, insurance, and compliance documents",
  settings: "Property configuration and preferences",
};

interface Props {
  activeView: HavenView;
  currentProperty: Property;
  children?: React.ReactNode;
}

const HavenHeader: React.FC<Props> = ({ activeView, currentProperty, children }) => (
  <div className="mb-6">
    {/* Breadcrumb */}
    <div className="flex items-center gap-1.5 text-xs mb-3" style={{ color: "#94A3B8" }}>
      <span>Haven</span>
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>
      <span style={{ color: "#0D9488" }}>{currentProperty.name}</span>
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>
      <span style={{ color: "#0F172A" }}>{viewLabels[activeView]}</span>
    </div>

    {/* Title row */}
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold" style={{ color: "#0F172A" }}>
          {viewLabels[activeView]}
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>
          {viewDescriptions[activeView]}
        </p>
      </div>
      {children}
    </div>
  </div>
);

export default HavenHeader;
