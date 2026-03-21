import React, { useState, useMemo } from "react";
import { documents } from "../../haven.data";
import type { Document } from "../../haven.data";

// ── Config ───────────────────────────────

const typeFilters = [
  { id: "all", label: "All" },
  { id: "lease", label: "Leases" },
  { id: "ejari", label: "Ejari" },
  { id: "trade_license", label: "Trade License" },
  { id: "insurance", label: "Insurance" },
  { id: "noc", label: "NOC" },
  { id: "id_copy", label: "ID Copies" },
] as const;

const typeIcons: Record<string, string> = {
  lease: "📄",
  ejari: "📋",
  trade_license: "🏛️",
  insurance: "🛡️",
  noc: "📝",
  id_copy: "🪪",
  other: "📎",
};

const typeLabels: Record<string, string> = {
  lease: "Lease Agreement",
  ejari: "Ejari Certificate",
  trade_license: "Trade License",
  insurance: "Insurance Policy",
  noc: "NOC",
  id_copy: "ID Document",
  other: "Other",
};

const statusBadge: Record<string, { bg: string; color: string; border: string }> = {
  valid: { bg: "#F0FDF4", color: "#166534", border: "#BBF7D0" },
  expiring: { bg: "#FFFBEB", color: "#92400E", border: "#FDE68A" },
  expired: { bg: "#FEF2F2", color: "#991B1B", border: "#FECACA" },
};

// ── Component ────────────────────────────

const HavenDocumentsView: React.FC = () => {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let docs = documents;
    if (typeFilter !== "all") {
      docs = docs.filter((d) => d.type === typeFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      docs = docs.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          (d.tenantName && d.tenantName.toLowerCase().includes(q)),
      );
    }
    return docs;
  }, [typeFilter, search]);

  const expiring = documents.filter((d) => d.status === "expiring").length;
  const expired = documents.filter((d) => d.status === "expired").length;

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Documents", value: String(documents.length), color: "#0F172A" },
          { label: "Valid", value: String(documents.filter((d) => d.status === "valid").length), color: "#22C55E" },
          { label: "Expiring Soon", value: String(expiring), color: "#F59E0B" },
          { label: "Expired", value: String(expired), color: "#EF4444" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl p-4" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}>
            <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#94A3B8" }}>{stat.label}</p>
            <p className="text-xl font-bold mt-1" style={{ color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Expiring alert */}
      {expiring > 0 && (
        <div className="mb-5 p-4 rounded-xl" style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A" }}>
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="#F59E0B" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <div>
              <p className="text-sm font-semibold" style={{ color: "#92400E" }}>
                {expiring} document{expiring > 1 ? "s" : ""} expiring soon
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#B45309" }}>
                {documents.filter((d) => d.status === "expiring").map((d) => d.name).join(", ")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid #E2E8F0" }}>
          {typeFilters.map((f) => (
            <button
              key={f.id}
              onClick={() => setTypeFilter(f.id)}
              className="px-3 py-1.5 text-xs font-medium transition-colors"
              style={{
                backgroundColor: typeFilter === f.id ? "#0D9488" : "#FFFFFF",
                color: typeFilter === f.id ? "#FFFFFF" : "#64748B",
                borderRight: "1px solid #E2E8F0",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="#94A3B8" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg text-xs w-48"
              style={{ border: "1px solid #E2E8F0", color: "#0F172A", backgroundColor: "#FFFFFF", outline: "none" }}
            />
          </div>
          <button className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: "#0D9488", color: "#FFFFFF" }}>
            Upload
          </button>
        </div>
      </div>

      {/* Document list */}
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #E2E8F0" }}>
        {filtered.length === 0 ? (
          <div className="text-center py-16" style={{ backgroundColor: "#FFFFFF" }}>
            <p className="text-sm" style={{ color: "#94A3B8" }}>No documents found</p>
          </div>
        ) : (
          filtered.map((doc, i) => (
            <DocumentRow key={doc.id} doc={doc} isLast={i === filtered.length - 1} />
          ))
        )}
      </div>
    </div>
  );
};

// ── Document row ─────────────────────────

const DocumentRow: React.FC<{ doc: Document; isLast: boolean }> = ({ doc, isLast }) => {
  const badge = statusBadge[doc.status];

  return (
    <div
      className="flex items-center gap-4 px-4 py-3 transition-colors cursor-pointer"
      style={{
        backgroundColor: "#FFFFFF",
        borderBottom: isLast ? "none" : "1px solid #F1F5F9",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#F8FAFC"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#FFFFFF"; }}
    >
      {/* Icon */}
      <span className="text-xl shrink-0">{typeIcons[doc.type]}</span>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: "#0F172A" }}>{doc.name}</p>
        <div className="flex items-center gap-3 mt-0.5 text-[11px]" style={{ color: "#94A3B8" }}>
          <span>{typeLabels[doc.type]}</span>
          {doc.tenantName && (
            <>
              <span>·</span>
              <span>{doc.tenantName}</span>
            </>
          )}
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4 shrink-0">
        <span className="text-[11px]" style={{ color: "#94A3B8" }}>{doc.fileSize}</span>
        {doc.expiryDate && (
          <span className="text-[11px]" style={{ color: doc.status === "expiring" ? "#F59E0B" : "#64748B" }}>
            Exp: {doc.expiryDate}
          </span>
        )}
        <span
          className="px-2 py-0.5 rounded-full text-[10px] font-medium"
          style={{ backgroundColor: badge.bg, color: badge.color, border: `1px solid ${badge.border}` }}
        >
          {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
        </span>
        {/* Download icon */}
        <button className="p-1 rounded hover:bg-gray-100 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#94A3B8" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default HavenDocumentsView;
