// ──────────────────────────────────────────
// Haven — Property Manager · Mock Data
// ──────────────────────────────────────────

// ── Types ────────────────────────────────

export interface Tenant {
  name: string;
  email: string;
  phone: string;
  leaseEnd: string;
  leaseStart: string;
  monthlyRent: number;
  idType: string;
  nationality: string;
}

export interface Unit {
  id: string;
  label: string;
  floor: number;
  type: string;
  status: "occupied" | "vacant" | "overdue";
  tenant?: Tenant;
  lastPayment?: string;
  monthlyRent: number;
  area: number; // sq ft
}

export interface Property {
  id: string;
  name: string;
  address: string;
  type: "apartment" | "villa" | "mixed";
  totalArea: number;
  yearBuilt: number;
  units: Unit[];
}

export interface PaymentRecord {
  id: string;
  tenantName: string;
  unitLabel: string;
  propertyId: string;
  amount: number;
  date: string;
  method: "bank_transfer" | "cheque" | "card" | "cash";
  status: "completed" | "pending" | "failed" | "refunded";
  reference: string;
}

export interface MaintenanceRequest {
  id: string;
  unitLabel: string;
  unitId: string;
  propertyId: string;
  tenantName: string;
  category: "plumbing" | "electrical" | "hvac" | "general" | "pest_control" | "painting";
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "cancelled";
  title: string;
  description: string;
  dateSubmitted: string;
  dateResolved?: string;
  assignedTo?: string;
  cost?: number;
}

export interface Document {
  id: string;
  name: string;
  type: "lease" | "ejari" | "trade_license" | "insurance" | "noc" | "id_copy" | "other";
  propertyId?: string;
  unitId?: string;
  tenantName?: string;
  uploadDate: string;
  expiryDate?: string;
  status: "valid" | "expiring" | "expired";
  fileSize: string;
}

export interface MonthlyIncome {
  month: string;
  expected: number;
  collected: number;
}

export type HavenView = "units" | "tenants" | "financials" | "maintenance" | "documents" | "settings";

// ── Nav items ────────────────────────────

export interface NavItem {
  id: HavenView;
  label: string;
  icon: string; // icon name mapped in sidebar
}

export const navItems: NavItem[] = [
  { id: "units", label: "Units", icon: "grid" },
  { id: "tenants", label: "Tenants", icon: "users" },
  { id: "financials", label: "Financials", icon: "dollar" },
  { id: "maintenance", label: "Maintenance", icon: "wrench" },
  { id: "documents", label: "Documents", icon: "folder" },
  { id: "settings", label: "Settings", icon: "cog" },
];

// ── Properties & Units ───────────────────

export const properties: Property[] = [
  {
    id: "p1",
    name: "Marina Heights",
    address: "Dubai Marina, Tower B",
    type: "apartment",
    totalArea: 12400,
    yearBuilt: 2019,
    units: [
      { id: "u1", label: "APT 101", floor: 1, type: "1BR", status: "occupied", monthlyRent: 5500, area: 750, lastPayment: "2024-03-01", tenant: { name: "Sarah Al-Rashid", email: "sarah@email.com", phone: "+971 50 123 4567", leaseStart: "2024-01-01", leaseEnd: "2024-12-31", monthlyRent: 5500, idType: "Emirates ID", nationality: "UAE" } },
      { id: "u2", label: "APT 102", floor: 1, type: "2BR", status: "occupied", monthlyRent: 8200, area: 1100, lastPayment: "2024-03-01", tenant: { name: "James Porter", email: "james@email.com", phone: "+971 55 234 5678", leaseStart: "2023-03-15", leaseEnd: "2025-03-15", monthlyRent: 8200, idType: "Passport", nationality: "UK" } },
      { id: "u3", label: "APT 201", floor: 2, type: "1BR", status: "overdue", monthlyRent: 5800, area: 780, lastPayment: "2024-01-15", tenant: { name: "Ahmed Mansour", email: "ahmed@email.com", phone: "+971 52 345 6789", leaseStart: "2023-10-01", leaseEnd: "2024-09-30", monthlyRent: 5800, idType: "Emirates ID", nationality: "Egypt" } },
      { id: "u4", label: "APT 202", floor: 2, type: "Studio", status: "vacant", monthlyRent: 3900, area: 480 },
      { id: "u5", label: "APT 301", floor: 3, type: "2BR", status: "occupied", monthlyRent: 8500, area: 1150, lastPayment: "2024-03-02", tenant: { name: "Lisa Chen", email: "lisa@email.com", phone: "+971 56 456 7890", leaseStart: "2024-07-01", leaseEnd: "2025-06-30", monthlyRent: 8500, idType: "Passport", nationality: "Singapore" } },
      { id: "u6", label: "APT 302", floor: 3, type: "1BR", status: "occupied", monthlyRent: 6000, area: 760, lastPayment: "2024-03-01", tenant: { name: "Khalid Nasser", email: "khalid@email.com", phone: "+971 50 567 8901", leaseStart: "2024-01-15", leaseEnd: "2024-11-15", monthlyRent: 6000, idType: "Emirates ID", nationality: "Saudi Arabia" } },
      { id: "u7", label: "APT 401", floor: 4, type: "3BR", status: "occupied", monthlyRent: 12000, area: 1600, lastPayment: "2024-03-01", tenant: { name: "Elena Volkov", email: "elena@email.com", phone: "+971 54 678 9012", leaseStart: "2024-09-01", leaseEnd: "2025-08-31", monthlyRent: 12000, idType: "Passport", nationality: "Russia" } },
      { id: "u8", label: "APT 402", floor: 4, type: "2BR", status: "vacant", monthlyRent: 8800, area: 1120 },
    ],
  },
  {
    id: "p2",
    name: "Al Barsha Residences",
    address: "Al Barsha 1, Block C",
    type: "apartment",
    totalArea: 6200,
    yearBuilt: 2016,
    units: [
      { id: "u9", label: "UNIT 1A", floor: 0, type: "Studio", status: "occupied", monthlyRent: 3200, area: 420, lastPayment: "2024-03-01", tenant: { name: "Priya Sharma", email: "priya@email.com", phone: "+971 55 789 0123", leaseStart: "2024-01-01", leaseEnd: "2024-10-31", monthlyRent: 3200, idType: "Passport", nationality: "India" } },
      { id: "u10", label: "UNIT 1B", floor: 0, type: "1BR", status: "overdue", monthlyRent: 4500, area: 650, lastPayment: "2024-02-01", tenant: { name: "Tom Williams", email: "tom@email.com", phone: "+971 52 890 1234", leaseStart: "2023-08-15", leaseEnd: "2024-08-15", monthlyRent: 4500, idType: "Passport", nationality: "Australia" } },
      { id: "u11", label: "UNIT 2A", floor: 1, type: "2BR", status: "occupied", monthlyRent: 6800, area: 980, lastPayment: "2024-03-03", tenant: { name: "Fatima Hassan", email: "fatima@email.com", phone: "+971 50 901 2345", leaseStart: "2024-03-01", leaseEnd: "2025-02-28", monthlyRent: 6800, idType: "Emirates ID", nationality: "UAE" } },
      { id: "u12", label: "UNIT 2B", floor: 1, type: "1BR", status: "vacant", monthlyRent: 4800, area: 680 },
    ],
  },
  {
    id: "p3",
    name: "JVC Garden View",
    address: "Jumeirah Village Circle, District 12",
    type: "villa",
    totalArea: 18000,
    yearBuilt: 2021,
    units: [
      { id: "u13", label: "VILLA 1", floor: 0, type: "3BR Villa", status: "occupied", monthlyRent: 15000, area: 3200, lastPayment: "2024-03-01", tenant: { name: "Robert & Maria Fischer", email: "fischer@email.com", phone: "+971 56 012 3456", leaseStart: "2023-12-01", leaseEnd: "2025-12-31", monthlyRent: 15000, idType: "Passport", nationality: "Germany" } },
      { id: "u14", label: "VILLA 2", floor: 0, type: "4BR Villa", status: "occupied", monthlyRent: 18500, area: 4200, lastPayment: "2024-03-01", tenant: { name: "Abdullah Al-Qassim", email: "abdullah@email.com", phone: "+971 54 123 4567", leaseStart: "2024-07-01", leaseEnd: "2025-06-30", monthlyRent: 18500, idType: "Emirates ID", nationality: "UAE" } },
      { id: "u15", label: "VILLA 3", floor: 0, type: "3BR Villa", status: "vacant", monthlyRent: 14500, area: 3100 },
    ],
  },
];

// ── Payment Records ──────────────────────

export const paymentRecords: PaymentRecord[] = [
  { id: "pay-01", tenantName: "Sarah Al-Rashid", unitLabel: "APT 101", propertyId: "p1", amount: 5500, date: "2024-03-01", method: "bank_transfer", status: "completed", reference: "TRN-2024-0301-001" },
  { id: "pay-02", tenantName: "James Porter", unitLabel: "APT 102", propertyId: "p1", amount: 8200, date: "2024-03-01", method: "cheque", status: "completed", reference: "CHQ-2024-0301-002" },
  { id: "pay-03", tenantName: "Lisa Chen", unitLabel: "APT 301", propertyId: "p1", amount: 8500, date: "2024-03-02", method: "card", status: "completed", reference: "CRD-2024-0302-003" },
  { id: "pay-04", tenantName: "Khalid Nasser", unitLabel: "APT 302", propertyId: "p1", amount: 6000, date: "2024-03-01", method: "bank_transfer", status: "completed", reference: "TRN-2024-0301-004" },
  { id: "pay-05", tenantName: "Elena Volkov", unitLabel: "APT 401", propertyId: "p1", amount: 12000, date: "2024-03-01", method: "bank_transfer", status: "completed", reference: "TRN-2024-0301-005" },
  { id: "pay-06", tenantName: "Priya Sharma", unitLabel: "UNIT 1A", propertyId: "p2", amount: 3200, date: "2024-03-01", method: "card", status: "completed", reference: "CRD-2024-0301-006" },
  { id: "pay-07", tenantName: "Fatima Hassan", unitLabel: "UNIT 2A", propertyId: "p2", amount: 6800, date: "2024-03-03", method: "bank_transfer", status: "completed", reference: "TRN-2024-0303-007" },
  { id: "pay-08", tenantName: "Robert & Maria Fischer", unitLabel: "VILLA 1", propertyId: "p3", amount: 15000, date: "2024-03-01", method: "cheque", status: "completed", reference: "CHQ-2024-0301-008" },
  { id: "pay-09", tenantName: "Abdullah Al-Qassim", unitLabel: "VILLA 2", propertyId: "p3", amount: 18500, date: "2024-03-01", method: "bank_transfer", status: "completed", reference: "TRN-2024-0301-009" },
  // Feb payments
  { id: "pay-10", tenantName: "Sarah Al-Rashid", unitLabel: "APT 101", propertyId: "p1", amount: 5500, date: "2024-02-01", method: "bank_transfer", status: "completed", reference: "TRN-2024-0201-010" },
  { id: "pay-11", tenantName: "James Porter", unitLabel: "APT 102", propertyId: "p1", amount: 8200, date: "2024-02-01", method: "cheque", status: "completed", reference: "CHQ-2024-0201-011" },
  { id: "pay-12", tenantName: "Tom Williams", unitLabel: "UNIT 1B", propertyId: "p2", amount: 4500, date: "2024-02-01", method: "card", status: "completed", reference: "CRD-2024-0201-012" },
  { id: "pay-13", tenantName: "Ahmed Mansour", unitLabel: "APT 201", propertyId: "p1", amount: 5800, date: "2024-01-15", method: "bank_transfer", status: "completed", reference: "TRN-2024-0115-013" },
  // Overdue / failed
  { id: "pay-14", tenantName: "Ahmed Mansour", unitLabel: "APT 201", propertyId: "p1", amount: 5800, date: "2024-02-15", method: "bank_transfer", status: "failed", reference: "TRN-2024-0215-014" },
  { id: "pay-15", tenantName: "Tom Williams", unitLabel: "UNIT 1B", propertyId: "p2", amount: 4500, date: "2024-03-01", method: "card", status: "failed", reference: "CRD-2024-0301-015" },
  // Jan payments
  { id: "pay-16", tenantName: "Elena Volkov", unitLabel: "APT 401", propertyId: "p1", amount: 12000, date: "2024-01-01", method: "bank_transfer", status: "completed", reference: "TRN-2024-0101-016" },
  { id: "pay-17", tenantName: "Khalid Nasser", unitLabel: "APT 302", propertyId: "p1", amount: 6000, date: "2024-01-01", method: "bank_transfer", status: "completed", reference: "TRN-2024-0101-017" },
  { id: "pay-18", tenantName: "Robert & Maria Fischer", unitLabel: "VILLA 1", propertyId: "p3", amount: 15000, date: "2024-02-01", method: "cheque", status: "completed", reference: "CHQ-2024-0201-018" },
  { id: "pay-19", tenantName: "Abdullah Al-Qassim", unitLabel: "VILLA 2", propertyId: "p3", amount: 18500, date: "2024-02-01", method: "bank_transfer", status: "completed", reference: "TRN-2024-0201-019" },
  { id: "pay-20", tenantName: "Lisa Chen", unitLabel: "APT 301", propertyId: "p1", amount: 8500, date: "2024-02-02", method: "card", status: "completed", reference: "CRD-2024-0202-020" },
];

// ── Maintenance Requests ─────────────────

export const maintenanceRequests: MaintenanceRequest[] = [
  {
    id: "mnt-01", unitLabel: "APT 201", unitId: "u3", propertyId: "p1", tenantName: "Ahmed Mansour",
    category: "hvac", priority: "high", status: "open",
    title: "AC not cooling properly",
    description: "The split AC in the bedroom is running but not producing cold air. Thermostat set to 22°C but room stays above 28°C.",
    dateSubmitted: "2024-03-18",
  },
  {
    id: "mnt-02", unitLabel: "APT 102", unitId: "u2", propertyId: "p1", tenantName: "James Porter",
    category: "plumbing", priority: "urgent", status: "in_progress",
    title: "Kitchen sink leaking",
    description: "Water is leaking from under the kitchen sink. The leak worsens when using the dishwasher. Placed a bucket underneath temporarily.",
    dateSubmitted: "2024-03-15", assignedTo: "Al Falak Maintenance LLC",
  },
  {
    id: "mnt-03", unitLabel: "VILLA 1", unitId: "u13", propertyId: "p3", tenantName: "Robert & Maria Fischer",
    category: "electrical", priority: "medium", status: "open",
    title: "Outdoor lights flickering",
    description: "The garden path lights flicker intermittently in the evening. Could be a wiring issue or faulty fixtures.",
    dateSubmitted: "2024-03-17",
  },
  {
    id: "mnt-04", unitLabel: "APT 301", unitId: "u5", propertyId: "p1", tenantName: "Lisa Chen",
    category: "pest_control", priority: "medium", status: "open",
    title: "Cockroaches in kitchen",
    description: "Noticed several cockroaches in the kitchen area over the past week, especially near the dishwasher.",
    dateSubmitted: "2024-03-16",
  },
  {
    id: "mnt-05", unitLabel: "UNIT 1A", unitId: "u9", propertyId: "p2", tenantName: "Priya Sharma",
    category: "general", priority: "low", status: "resolved",
    title: "Bedroom door handle loose",
    description: "The master bedroom door handle is wobbly and sometimes doesn't latch properly.",
    dateSubmitted: "2024-03-10", dateResolved: "2024-03-12", assignedTo: "Handyman Services", cost: 150,
  },
  {
    id: "mnt-06", unitLabel: "APT 401", unitId: "u7", propertyId: "p1", tenantName: "Elena Volkov",
    category: "plumbing", priority: "high", status: "in_progress",
    title: "Low water pressure in master bath",
    description: "Water pressure in the master bathroom has dropped significantly. Both shower and sink affected. Other bathrooms are fine.",
    dateSubmitted: "2024-03-14", assignedTo: "Dubai Plumbing Co.",
  },
  {
    id: "mnt-07", unitLabel: "VILLA 2", unitId: "u14", propertyId: "p3", tenantName: "Abdullah Al-Qassim",
    category: "hvac", priority: "medium", status: "resolved",
    title: "AC duct cleaning needed",
    description: "Annual AC duct cleaning and filter replacement for all units in the villa.",
    dateSubmitted: "2024-02-28", dateResolved: "2024-03-05", assignedTo: "CoolTech AC Services", cost: 1200,
  },
  {
    id: "mnt-08", unitLabel: "UNIT 2A", unitId: "u11", propertyId: "p2", tenantName: "Fatima Hassan",
    category: "painting", priority: "low", status: "open",
    title: "Wall paint peeling in living room",
    description: "Paint is peeling near the window in the living room, likely due to moisture. Approximately 2 sqm area affected.",
    dateSubmitted: "2024-03-19",
  },
  {
    id: "mnt-09", unitLabel: "APT 302", unitId: "u6", propertyId: "p1", tenantName: "Khalid Nasser",
    category: "electrical", priority: "high", status: "open",
    title: "Power outlet not working",
    description: "The double power outlet in the living room near the TV has stopped working. Tried resetting the breaker but it trips again.",
    dateSubmitted: "2024-03-20",
  },
  {
    id: "mnt-10", unitLabel: "APT 101", unitId: "u1", propertyId: "p1", tenantName: "Sarah Al-Rashid",
    category: "general", priority: "low", status: "resolved",
    title: "Replace bathroom mirror",
    description: "The bathroom mirror has a small crack in the corner. Requesting replacement.",
    dateSubmitted: "2024-02-20", dateResolved: "2024-02-25", assignedTo: "Glass & More LLC", cost: 350,
  },
  {
    id: "mnt-11", unitLabel: "UNIT 1B", unitId: "u10", propertyId: "p2", tenantName: "Tom Williams",
    category: "plumbing", priority: "medium", status: "cancelled",
    title: "Toilet running continuously",
    description: "The toilet in the guest bathroom runs continuously after flushing. Likely a flapper valve issue.",
    dateSubmitted: "2024-03-08",
  },
];

// ── Documents ────────────────────────────

export const documents: Document[] = [
  // Leases
  { id: "doc-01", name: "Lease — Sarah Al-Rashid (APT 101)", type: "lease", propertyId: "p1", unitId: "u1", tenantName: "Sarah Al-Rashid", uploadDate: "2024-01-02", expiryDate: "2024-12-31", status: "valid", fileSize: "2.4 MB" },
  { id: "doc-02", name: "Lease — James Porter (APT 102)", type: "lease", propertyId: "p1", unitId: "u2", tenantName: "James Porter", uploadDate: "2023-03-16", expiryDate: "2025-03-15", status: "valid", fileSize: "2.1 MB" },
  { id: "doc-03", name: "Lease — Ahmed Mansour (APT 201)", type: "lease", propertyId: "p1", unitId: "u3", tenantName: "Ahmed Mansour", uploadDate: "2023-10-02", expiryDate: "2024-09-30", status: "expiring", fileSize: "1.9 MB" },
  { id: "doc-04", name: "Lease — Lisa Chen (APT 301)", type: "lease", propertyId: "p1", unitId: "u5", tenantName: "Lisa Chen", uploadDate: "2024-07-02", expiryDate: "2025-06-30", status: "valid", fileSize: "2.3 MB" },
  { id: "doc-05", name: "Lease — R. & M. Fischer (VILLA 1)", type: "lease", propertyId: "p3", unitId: "u13", tenantName: "Robert & Maria Fischer", uploadDate: "2023-12-02", expiryDate: "2025-12-31", status: "valid", fileSize: "3.1 MB" },
  // Ejari
  { id: "doc-06", name: "Ejari — APT 101", type: "ejari", propertyId: "p1", unitId: "u1", tenantName: "Sarah Al-Rashid", uploadDate: "2024-01-05", expiryDate: "2024-12-31", status: "valid", fileSize: "540 KB" },
  { id: "doc-07", name: "Ejari — APT 102", type: "ejari", propertyId: "p1", unitId: "u2", tenantName: "James Porter", uploadDate: "2023-03-20", expiryDate: "2025-03-15", status: "valid", fileSize: "520 KB" },
  { id: "doc-08", name: "Ejari — VILLA 2", type: "ejari", propertyId: "p3", unitId: "u14", tenantName: "Abdullah Al-Qassim", uploadDate: "2024-07-05", expiryDate: "2025-06-30", status: "valid", fileSize: "510 KB" },
  // Trade License
  { id: "doc-09", name: "Trade License — Marina Heights", type: "trade_license", propertyId: "p1", uploadDate: "2023-06-15", expiryDate: "2024-06-14", status: "expiring", fileSize: "1.2 MB" },
  { id: "doc-10", name: "Trade License — Al Barsha Residences", type: "trade_license", propertyId: "p2", uploadDate: "2023-09-01", expiryDate: "2024-08-31", status: "valid", fileSize: "1.1 MB" },
  // Insurance
  { id: "doc-11", name: "Building Insurance — Marina Heights", type: "insurance", propertyId: "p1", uploadDate: "2024-01-10", expiryDate: "2025-01-09", status: "valid", fileSize: "3.8 MB" },
  { id: "doc-12", name: "Building Insurance — JVC Garden View", type: "insurance", propertyId: "p3", uploadDate: "2023-05-20", expiryDate: "2024-05-19", status: "expiring", fileSize: "4.2 MB" },
  // ID copies
  { id: "doc-13", name: "Emirates ID — Sarah Al-Rashid", type: "id_copy", tenantName: "Sarah Al-Rashid", uploadDate: "2024-01-02", expiryDate: "2026-01-01", status: "valid", fileSize: "890 KB" },
  { id: "doc-14", name: "Passport — James Porter", type: "id_copy", tenantName: "James Porter", uploadDate: "2023-03-16", expiryDate: "2028-11-20", status: "valid", fileSize: "1.1 MB" },
  // NOC
  { id: "doc-15", name: "NOC — Marina Heights (DEWA)", type: "noc", propertyId: "p1", uploadDate: "2023-06-18", status: "valid", fileSize: "420 KB" },
];

// ── Monthly Income Data (12 months) ──────

export const monthlyIncome: MonthlyIncome[] = [
  { month: "Apr 2023", expected: 88700, collected: 85200 },
  { month: "May 2023", expected: 88700, collected: 88700 },
  { month: "Jun 2023", expected: 88700, collected: 86400 },
  { month: "Jul 2023", expected: 88700, collected: 88700 },
  { month: "Aug 2023", expected: 88700, collected: 87100 },
  { month: "Sep 2023", expected: 88700, collected: 88700 },
  { month: "Oct 2023", expected: 88700, collected: 84800 },
  { month: "Nov 2023", expected: 88700, collected: 88700 },
  { month: "Dec 2023", expected: 88700, collected: 86900 },
  { month: "Jan 2024", expected: 88700, collected: 82500 },
  { month: "Feb 2024", expected: 88700, collected: 85700 },
  { month: "Mar 2024", expected: 88700, collected: 78400 },
];

// ── Notifications ────────────────────────

export interface HavenNotification {
  id: string;
  type: "overdue" | "maintenance" | "lease" | "payment";
  title: string;
  description: string;
  time: string;
  unread: boolean;
}

export const notifications: HavenNotification[] = [
  { id: "n1", type: "overdue", title: "Payment overdue", description: "Ahmed Mansour (APT 201) — AED 5,800 overdue since Feb 15", time: "2h ago", unread: true },
  { id: "n2", type: "maintenance", title: "Urgent maintenance", description: "Kitchen sink leak reported at APT 102", time: "5h ago", unread: true },
  { id: "n3", type: "lease", title: "Lease expiring", description: "Trade License — Marina Heights expires Jun 14", time: "1d ago", unread: true },
  { id: "n4", type: "payment", title: "Payment received", description: "Fatima Hassan (UNIT 2A) — AED 6,800", time: "2d ago", unread: false },
  { id: "n5", type: "overdue", title: "Payment overdue", description: "Tom Williams (UNIT 1B) — AED 4,500 overdue since Mar 1", time: "3d ago", unread: false },
];
