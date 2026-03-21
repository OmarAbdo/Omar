// ─── Types ───────────────────────────────────────────────────────────────────

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  totalBilled: number;
  totalPaid: number;
  invoiceCount: number;
  lastInvoiceDate: string;
  paymentRating: "excellent" | "good" | "fair" | "poor";
}

export interface InvoiceItem {
  description: string;
  qty: number;
  rate: number;
}

export interface Invoice {
  id: string;
  number: string;
  clientId: string;
  client: string;
  email: string;
  date: string;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
  amount: number;
  items: InvoiceItem[];
  notes?: string;
  paymentDate?: string;
  paymentMethod?: string;
}

export interface ActivityItem {
  id: string;
  type: "payment" | "sent" | "reminder" | "created" | "overdue";
  title: string;
  description: string;
  time: string;
  invoiceId?: string;
}

// ─── Clients ─────────────────────────────────────────────────────────────────

export const clients: Client[] = [
  {
    id: "c1",
    name: "Al Maktoum Ventures",
    email: "finance@almaktoum.ae",
    phone: "+971 4 555 0101",
    address: "DIFC Gate Building, Level 12",
    city: "Dubai",
    country: "UAE",
    totalBilled: 34500,
    totalPaid: 28700,
    invoiceCount: 4,
    lastInvoiceDate: "2024-03-18",
    paymentRating: "excellent",
  },
  {
    id: "c2",
    name: "Nordic Health Systems",
    email: "billing@nordichealthsys.com",
    phone: "+49 30 555 0202",
    address: "Friedrichstraße 112",
    city: "Berlin",
    country: "Germany",
    totalBilled: 18750,
    totalPaid: 18750,
    invoiceCount: 3,
    lastInvoiceDate: "2024-03-05",
    paymentRating: "excellent",
  },
  {
    id: "c3",
    name: "Bloom Studio Berlin",
    email: "hello@bloomstudio.de",
    phone: "+49 30 555 0303",
    address: "Torstraße 89",
    city: "Berlin",
    country: "Germany",
    totalBilled: 8400,
    totalPaid: 4200,
    invoiceCount: 2,
    lastInvoiceDate: "2024-03-10",
    paymentRating: "good",
  },
  {
    id: "c4",
    name: "Riyad Capital Partners",
    email: "accounts@riyadcp.sa",
    phone: "+966 11 555 0404",
    address: "King Fahd Road, Tower 3",
    city: "Riyadh",
    country: "Saudi Arabia",
    totalBilled: 32400,
    totalPaid: 13500,
    invoiceCount: 3,
    lastInvoiceDate: "2024-03-20",
    paymentRating: "poor",
  },
  {
    id: "c5",
    name: "Greenfield Logistics",
    email: "ops@greenfieldlog.com",
    phone: "+971 4 555 0505",
    address: "Jebel Ali Free Zone",
    city: "Dubai",
    country: "UAE",
    totalBilled: 14800,
    totalPaid: 8500,
    invoiceCount: 3,
    lastInvoiceDate: "2024-03-12",
    paymentRating: "good",
  },
  {
    id: "c6",
    name: "TechBridge Consulting",
    email: "pay@techbridge.io",
    phone: "+44 20 555 0606",
    address: "Old Street, Shoreditch",
    city: "London",
    country: "UK",
    totalBilled: 7500,
    totalPaid: 7500,
    invoiceCount: 2,
    lastInvoiceDate: "2024-03-14",
    paymentRating: "excellent",
  },
  {
    id: "c7",
    name: "Marina Bay Properties",
    email: "finance@marinabay.ae",
    phone: "+971 4 555 0707",
    address: "Marina Walk, Tower B",
    city: "Dubai",
    country: "UAE",
    totalBilled: 16200,
    totalPaid: 7000,
    invoiceCount: 2,
    lastInvoiceDate: "2024-02-20",
    paymentRating: "fair",
  },
  {
    id: "c8",
    name: "Sahara Digital Agency",
    email: "invoices@saharadigital.ae",
    phone: "+971 4 555 0808",
    address: "Business Bay, Executive Tower",
    city: "Dubai",
    country: "UAE",
    totalBilled: 11200,
    totalPaid: 5600,
    invoiceCount: 2,
    lastInvoiceDate: "2024-03-18",
    paymentRating: "good",
  },
  {
    id: "c9",
    name: "Lumen Analytics GmbH",
    email: "billing@lumenanalytics.de",
    phone: "+49 89 555 0909",
    address: "Maximilianstraße 40",
    city: "Munich",
    country: "Germany",
    totalBilled: 9800,
    totalPaid: 9800,
    invoiceCount: 2,
    lastInvoiceDate: "2024-03-22",
    paymentRating: "excellent",
  },
  {
    id: "c10",
    name: "Falcon Security Solutions",
    email: "accounts@falconsec.ae",
    phone: "+971 2 555 1010",
    address: "Al Maryah Island",
    city: "Abu Dhabi",
    country: "UAE",
    totalBilled: 22000,
    totalPaid: 15000,
    invoiceCount: 2,
    lastInvoiceDate: "2024-03-25",
    paymentRating: "good",
  },
];

// ─── Invoices ────────────────────────────────────────────────────────────────

export const invoices: Invoice[] = [
  {
    id: "1",
    number: "INV-2024-001",
    clientId: "c1",
    client: "Al Maktoum Ventures",
    email: "finance@almaktoum.ae",
    date: "2024-01-15",
    dueDate: "2024-02-15",
    status: "paid",
    amount: 12500,
    paymentDate: "2024-02-10",
    paymentMethod: "Bank Transfer",
    items: [
      { description: "Web Application Development", qty: 1, rate: 8000 },
      { description: "API Integration & Testing", qty: 1, rate: 3000 },
      { description: "Deployment & Configuration", qty: 1, rate: 1500 },
    ],
    notes: "Phase 1 of the digital transformation project. Includes 30-day support window.",
  },
  {
    id: "2",
    number: "INV-2024-002",
    clientId: "c2",
    client: "Nordic Health Systems",
    email: "billing@nordichealthsys.com",
    date: "2024-02-01",
    dueDate: "2024-03-01",
    status: "paid",
    amount: 8750,
    paymentDate: "2024-02-22",
    paymentMethod: "Bank Transfer",
    items: [
      { description: "Dashboard UI Design & Build", qty: 1, rate: 5500 },
      { description: "Data Visualisation Components", qty: 1, rate: 3250 },
    ],
    notes: "Patient analytics dashboard. React + D3 components.",
  },
  {
    id: "3",
    number: "INV-2024-003",
    clientId: "c3",
    client: "Bloom Studio Berlin",
    email: "hello@bloomstudio.de",
    date: "2024-02-15",
    dueDate: "2024-03-15",
    status: "pending",
    amount: 4200,
    items: [
      { description: "Brand Website Redesign", qty: 1, rate: 3200 },
      { description: "CMS Integration", qty: 1, rate: 1000 },
    ],
    notes: "Figma-to-code implementation. Using their existing Contentful CMS.",
  },
  {
    id: "4",
    number: "INV-2024-004",
    clientId: "c4",
    client: "Riyad Capital Partners",
    email: "accounts@riyadcp.sa",
    date: "2024-01-20",
    dueDate: "2024-02-20",
    status: "overdue",
    amount: 18900,
    items: [
      { description: "Trading Platform Frontend", qty: 1, rate: 12000 },
      { description: "Real-time Data Feed Integration", qty: 1, rate: 4500 },
      { description: "Performance Optimisation", qty: 1, rate: 2400 },
    ],
    notes: "Critical path: WebSocket feed integration. Reminder sent on March 1.",
  },
  {
    id: "5",
    number: "INV-2024-005",
    clientId: "c5",
    client: "Greenfield Logistics",
    email: "ops@greenfieldlog.com",
    date: "2024-02-20",
    dueDate: "2024-03-20",
    status: "pending",
    amount: 6300,
    items: [
      { description: "Fleet Tracking Dashboard", qty: 1, rate: 4300 },
      { description: "Driver Mobile App Screens", qty: 1, rate: 2000 },
    ],
  },
  {
    id: "6",
    number: "INV-2024-006",
    clientId: "c6",
    client: "TechBridge Consulting",
    email: "pay@techbridge.io",
    date: "2024-02-25",
    dueDate: "2024-03-25",
    status: "paid",
    amount: 3500,
    paymentDate: "2024-03-18",
    paymentMethod: "Wire Transfer",
    items: [
      { description: "Technical Architecture Review", qty: 1, rate: 2500 },
      { description: "Documentation & Handoff", qty: 1, rate: 1000 },
    ],
  },
  {
    id: "7",
    number: "INV-2024-007",
    clientId: "c7",
    client: "Marina Bay Properties",
    email: "finance@marinabay.ae",
    date: "2024-01-25",
    dueDate: "2024-02-25",
    status: "overdue",
    amount: 9200,
    items: [
      { description: "Property Management Portal", qty: 1, rate: 7200 },
      { description: "Tenant Notification System", qty: 1, rate: 2000 },
    ],
    notes: "Follow-up: client requested 15-day extension. No payment received.",
  },
  {
    id: "8",
    number: "INV-2024-008",
    clientId: "c8",
    client: "Sahara Digital Agency",
    email: "invoices@saharadigital.ae",
    date: "2024-03-01",
    dueDate: "2024-04-01",
    status: "pending",
    amount: 5600,
    items: [
      { description: "E-commerce Frontend Build", qty: 1, rate: 4100 },
      { description: "Payment Gateway Integration", qty: 1, rate: 1500 },
    ],
  },
  {
    id: "9",
    number: "INV-2024-009",
    clientId: "c1",
    client: "Al Maktoum Ventures",
    email: "finance@almaktoum.ae",
    date: "2024-03-10",
    dueDate: "2024-04-10",
    status: "pending",
    amount: 14500,
    items: [
      { description: "Mobile App Development (Phase 2)", qty: 1, rate: 9500 },
      { description: "Push Notification System", qty: 1, rate: 3000 },
      { description: "App Store Submission & QA", qty: 1, rate: 2000 },
    ],
    notes: "Phase 2 — React Native. Depends on Phase 1 API completion.",
  },
  {
    id: "10",
    number: "INV-2024-010",
    clientId: "c9",
    client: "Lumen Analytics GmbH",
    email: "billing@lumenanalytics.de",
    date: "2024-03-15",
    dueDate: "2024-04-15",
    status: "paid",
    amount: 6800,
    paymentDate: "2024-03-28",
    paymentMethod: "SEPA Transfer",
    items: [
      { description: "Data Pipeline Dashboard", qty: 1, rate: 4800 },
      { description: "Alert Configuration UI", qty: 1, rate: 2000 },
    ],
  },
  {
    id: "11",
    number: "INV-2024-011",
    clientId: "c4",
    client: "Riyad Capital Partners",
    email: "accounts@riyadcp.sa",
    date: "2024-03-18",
    dueDate: "2024-04-18",
    status: "pending",
    amount: 7500,
    items: [
      { description: "Portfolio Analytics Module", qty: 1, rate: 5500 },
      { description: "Report Export System", qty: 1, rate: 2000 },
    ],
    notes: "Held pending payment of INV-2024-004.",
  },
  {
    id: "12",
    number: "INV-2024-012",
    clientId: "c10",
    client: "Falcon Security Solutions",
    email: "accounts@falconsec.ae",
    date: "2024-03-22",
    dueDate: "2024-04-22",
    status: "pending",
    amount: 15000,
    items: [
      { description: "Security Dashboard Frontend", qty: 1, rate: 8500 },
      { description: "Incident Reporting Module", qty: 1, rate: 4000 },
      { description: "Access Control Panel UI", qty: 1, rate: 2500 },
    ],
    notes: "NDA signed. All source code to be delivered via private repo.",
  },
  {
    id: "13",
    number: "INV-2024-013",
    clientId: "c10",
    client: "Falcon Security Solutions",
    email: "accounts@falconsec.ae",
    date: "2024-02-10",
    dueDate: "2024-03-10",
    status: "paid",
    amount: 7000,
    paymentDate: "2024-03-08",
    paymentMethod: "Bank Transfer",
    items: [
      { description: "Security Audit & Consultation", qty: 1, rate: 4500 },
      { description: "Vulnerability Assessment Report", qty: 1, rate: 2500 },
    ],
  },
  {
    id: "14",
    number: "INV-2024-014",
    clientId: "c2",
    client: "Nordic Health Systems",
    email: "billing@nordichealthsys.com",
    date: "2024-03-20",
    dueDate: "2024-04-20",
    status: "pending",
    amount: 10000,
    items: [
      { description: "Telemedicine Interface Build", qty: 1, rate: 7000 },
      { description: "Video Call Integration", qty: 1, rate: 3000 },
    ],
    notes: "WebRTC integration. Requires HIPAA-compliant hosting.",
  },
];

// ─── Activity Feed ───────────────────────────────────────────────────────────

export const activityFeed: ActivityItem[] = [
  {
    id: "a1",
    type: "payment",
    title: "Payment received",
    description: "Lumen Analytics GmbH paid INV-2024-010",
    time: "2 hours ago",
    invoiceId: "10",
  },
  {
    id: "a2",
    type: "sent",
    title: "Invoice sent",
    description: "INV-2024-014 sent to Nordic Health Systems",
    time: "5 hours ago",
    invoiceId: "14",
  },
  {
    id: "a3",
    type: "reminder",
    title: "Payment reminder sent",
    description: "Reminder sent to Riyad Capital Partners for INV-2024-004",
    time: "1 day ago",
    invoiceId: "4",
  },
  {
    id: "a4",
    type: "created",
    title: "Invoice created",
    description: "INV-2024-012 created for Falcon Security Solutions",
    time: "2 days ago",
    invoiceId: "12",
  },
  {
    id: "a5",
    type: "overdue",
    title: "Invoice overdue",
    description: "INV-2024-007 from Marina Bay Properties is 25 days overdue",
    time: "3 days ago",
    invoiceId: "7",
  },
  {
    id: "a6",
    type: "payment",
    title: "Payment received",
    description: "TechBridge Consulting paid INV-2024-006",
    time: "3 days ago",
    invoiceId: "6",
  },
  {
    id: "a7",
    type: "sent",
    title: "Invoice sent",
    description: "INV-2024-011 sent to Riyad Capital Partners",
    time: "4 days ago",
    invoiceId: "11",
  },
  {
    id: "a8",
    type: "reminder",
    title: "Payment reminder sent",
    description: "Second reminder sent to Marina Bay Properties for INV-2024-007",
    time: "5 days ago",
    invoiceId: "7",
  },
  {
    id: "a9",
    type: "payment",
    title: "Payment received",
    description: "Falcon Security Solutions paid INV-2024-013",
    time: "6 days ago",
    invoiceId: "13",
  },
  {
    id: "a10",
    type: "created",
    title: "Invoice created",
    description: "INV-2024-009 created for Al Maktoum Ventures",
    time: "1 week ago",
    invoiceId: "9",
  },
];

// ─── Computed KPIs ───────────────────────────────────────────────────────────

const paidInvoices = invoices.filter((i) => i.status === "paid");
const pendingInvoices = invoices.filter((i) => i.status === "pending");
const overdueInvoices = invoices.filter((i) => i.status === "overdue");

export const kpiData = {
  totalRevenue: invoices.reduce((sum, inv) => sum + inv.amount, 0),
  totalPaid: paidInvoices.reduce((sum, inv) => sum + inv.amount, 0),
  totalOutstanding: [...pendingInvoices, ...overdueInvoices].reduce((sum, inv) => sum + inv.amount, 0),
  totalOverdue: overdueInvoices.reduce((sum, inv) => sum + inv.amount, 0),
  invoiceCount: invoices.length,
  paidCount: paidInvoices.length,
  pendingCount: pendingInvoices.length,
  overdueCount: overdueInvoices.length,
  avgInvoiceValue: Math.round(invoices.reduce((sum, inv) => sum + inv.amount, 0) / invoices.length),
  collectionRate: Math.round((paidInvoices.reduce((sum, inv) => sum + inv.amount, 0) / invoices.reduce((sum, inv) => sum + inv.amount, 0)) * 100),
};

// ─── Monthly Revenue Data (for charts) ───────────────────────────────────────

export const monthlyRevenue = [
  { month: "Apr", revenue: 4200, collected: 4200 },
  { month: "May", revenue: 8100, collected: 6800 },
  { month: "Jun", revenue: 12750, collected: 10500 },
  { month: "Jul", revenue: 9400, collected: 8200 },
  { month: "Aug", revenue: 15500, collected: 12500 },
  { month: "Sep", revenue: 11800, collected: 9800 },
  { month: "Oct", revenue: 13200, collected: 11400 },
  { month: "Nov", revenue: 16300, collected: 14100 },
  { month: "Dec", revenue: 10500, collected: 8900 },
  { month: "Jan", revenue: 19400, collected: 15500 },
  { month: "Feb", revenue: 22250, collected: 18750 },
  { month: "Mar", revenue: 46600, collected: 31550 },
];

// ─── Top Clients by Revenue ─────────────────────────────────────────────────

export const topClientsByRevenue = clients
  .slice()
  .sort((a, b) => b.totalBilled - a.totalBilled)
  .slice(0, 5);

// ─── Settings Defaults ───────────────────────────────────────────────────────

export const businessProfile = {
  name: "Omar Abdo",
  title: "Senior Software Developer",
  email: "omar@omarabdo.com",
  phone: "+49 176 555 0000",
  address: "Berlin, Germany",
  taxId: "DE 301234567",
  currency: "USD",
  paymentTerms: "Net 30",
  bankName: "Deutsche Bank",
  iban: "DE89 3704 0044 0532 0130 00",
  bic: "COBADEFFXXX",
};

export const notificationSettings = {
  emailOnPayment: true,
  emailOnOverdue: true,
  weeklyDigest: true,
  reminderBeforeDue: true,
  reminderDaysBefore: 3,
};
