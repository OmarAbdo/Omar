// ── Types ──────────────────────────────────────────────────────────

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  tags: string[];
  joinDate: string;
  totalBookings: number;
  totalSpent: number;
  lastVisit: string;
}

export interface Service {
  id: string;
  name: string;
  duration: number; // hours
  price: number;
  color: string; // tailwind-style hex
  bgColor: string;
  borderColor: string;
  textColor: string;
  description: string;
  active: boolean;
}

export type AppointmentStatus = "confirmed" | "pending" | "cancelled" | "completed";

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  serviceId: string;
  service: string;
  day: number; // 0=Mon, 1=Tue, ..., 6=Sun
  startHour: number; // e.g., 9, 10.5
  duration: number; // hours
  status: AppointmentStatus;
}

export type ActivityType = "booked" | "confirmed" | "cancelled" | "rescheduled" | "completed";

export interface ActivityEntry {
  id: string;
  type: ActivityType;
  clientName: string;
  service: string;
  description: string;
  timestamp: string;
  dateGroup: "today" | "yesterday" | "thisWeek" | "earlier";
}

export interface BusinessHours {
  day: string;
  open: string;
  close: string;
  enabled: boolean;
}

// ── Services ───────────────────────────────────────────────────────

export const services: Service[] = [
  {
    id: "s1",
    name: "Strategy Session",
    duration: 1,
    price: 150,
    color: "#C2703E",
    bgColor: "#C2703E18",
    borderColor: "#C2703E40",
    textColor: "#92400E",
    description: "High-level product and technical strategy alignment.",
    active: true,
  },
  {
    id: "s2",
    name: "Initial Consultation",
    duration: 1.5,
    price: 200,
    color: "#0D9488",
    bgColor: "#0D948818",
    borderColor: "#0D948840",
    textColor: "#115E59",
    description: "First meeting to assess project scope and fit.",
    active: true,
  },
  {
    id: "s3",
    name: "Follow-up Review",
    duration: 1,
    price: 100,
    color: "#7C3AED",
    bgColor: "#7C3AED18",
    borderColor: "#7C3AED40",
    textColor: "#5B21B6",
    description: "Progress review and next-steps planning.",
    active: true,
  },
  {
    id: "s4",
    name: "Monthly Consultation",
    duration: 2,
    price: 300,
    color: "#2563EB",
    bgColor: "#2563EB18",
    borderColor: "#2563EB40",
    textColor: "#1E40AF",
    description: "Recurring deep-dive on ongoing projects.",
    active: true,
  },
  {
    id: "s5",
    name: "Architecture Review",
    duration: 1.5,
    price: 250,
    color: "#DC2626",
    bgColor: "#DC262618",
    borderColor: "#DC262640",
    textColor: "#991B1B",
    description: "System design audit and recommendations.",
    active: true,
  },
  {
    id: "s6",
    name: "Code Review",
    duration: 2,
    price: 200,
    color: "#059669",
    bgColor: "#05966918",
    borderColor: "#05966940",
    textColor: "#065F46",
    description: "Line-by-line code quality and best practice review.",
    active: true,
  },
  {
    id: "s7",
    name: "Sprint Review",
    duration: 1,
    price: 120,
    color: "#D97706",
    bgColor: "#D9770618",
    borderColor: "#D9770640",
    textColor: "#92400E",
    description: "End-of-sprint demo and retrospective.",
    active: true,
  },
  {
    id: "s8",
    name: "Deployment Support",
    duration: 1,
    price: 175,
    color: "#DB2777",
    bgColor: "#DB277718",
    borderColor: "#DB277740",
    textColor: "#9D174D",
    description: "Guided production deployment and rollback planning.",
    active: false,
  },
];

const serviceMap = Object.fromEntries(services.map((s) => [s.id, s]));
export const getService = (id: string): Service => serviceMap[id] ?? services[0];

// ── Clients ────────────────────────────────────────────────────────

export const clients: Client[] = [
  { id: "c1", name: "Nadia Al-Farsi", email: "nadia@alfarsi.ae", phone: "+971 50 111 2233", notes: "Prefers morning slots. CEO of a logistics startup.", tags: ["VIP", "Recurring"], joinDate: "2025-06-14", totalBookings: 18, totalSpent: 3400, lastVisit: "2026-03-18" },
  { id: "c2", name: "Marcus Weber", email: "marcus@weber.de", phone: "+49 170 456 7890", notes: "New client, referred by Lisa Chen. Building a fintech MVP.", tags: ["New"], joinDate: "2026-02-20", totalBookings: 3, totalSpent: 550, lastVisit: "2026-03-18" },
  { id: "c3", name: "Aisha Mohammed", email: "aisha@techgulf.com", phone: "+971 55 333 4455", notes: "CTO, very technical. Prefers short focused sessions.", tags: ["Recurring"], joinDate: "2025-09-02", totalBookings: 12, totalSpent: 2100, lastVisit: "2026-03-19" },
  { id: "c4", name: "Thomas Eriksson", email: "thomas@eriksson.se", phone: "+46 73 890 1234", notes: "Monthly retainer client. Based in Stockholm.", tags: ["VIP", "Recurring"], joinDate: "2025-04-10", totalBookings: 24, totalSpent: 7200, lastVisit: "2026-03-19" },
  { id: "c5", name: "Yara Haddad", email: "yara@haddad.io", phone: "+971 52 555 6677", notes: "Product manager. Scaling a marketplace app.", tags: [], joinDate: "2025-11-15", totalBookings: 7, totalSpent: 1350, lastVisit: "2026-03-20" },
  { id: "c6", name: "Daniel Kim", email: "daniel@kimetrics.kr", phone: "+82 10 7890 1234", notes: "Remote client, Seoul timezone. Schedule carefully.", tags: ["Remote"], joinDate: "2026-01-08", totalBookings: 5, totalSpent: 900, lastVisit: "2026-03-20" },
  { id: "c7", name: "Fatima Al-Rashid", email: "fatima@rashidgroup.ae", phone: "+971 56 222 3344", notes: "Enterprise client. Multiple ongoing projects.", tags: ["VIP", "Enterprise"], joinDate: "2025-03-20", totalBookings: 30, totalSpent: 9500, lastVisit: "2026-03-21" },
  { id: "c8", name: "Lukas Braun", email: "lukas@braun.tech", phone: "+49 151 234 5678", notes: "Solo founder. Bootstrapping an AI tool.", tags: ["New"], joinDate: "2026-03-01", totalBookings: 2, totalSpent: 350, lastVisit: "2026-03-17" },
  { id: "c9", name: "Sara Jensen", email: "sara@nordichealth.dk", phone: "+45 20 123 456", notes: "Healthcare SaaS. Compliance-heavy project.", tags: ["Recurring"], joinDate: "2025-08-11", totalBookings: 10, totalSpent: 2400, lastVisit: "2026-03-14" },
  { id: "c10", name: "Khalid Mansoor", email: "khalid@mansoor.qa", phone: "+974 55 678 9012", notes: "Government adjacent. Formal communication preferred.", tags: ["Enterprise"], joinDate: "2025-07-05", totalBookings: 8, totalSpent: 2000, lastVisit: "2026-03-12" },
  { id: "c11", name: "Lisa Chen", email: "lisa@pixelcraft.hk", phone: "+852 9123 4567", notes: "Design agency owner. Refers clients regularly.", tags: ["Recurring", "Referrer"], joinDate: "2025-05-22", totalBookings: 14, totalSpent: 2800, lastVisit: "2026-03-10" },
  { id: "c12", name: "Omar Hassan", email: "omar@buildstack.com", phone: "+20 100 567 8901", notes: "Dev shop in Cairo. Co-development partner.", tags: ["Partner"], joinDate: "2025-10-30", totalBookings: 9, totalSpent: 1650, lastVisit: "2026-03-07" },
];

// ── Appointments ───────────────────────────────────────────────────

export const appointments: Appointment[] = [
  // Monday
  { id: "a1", clientId: "c1", clientName: "Nadia Al-Farsi", serviceId: "s1", service: "Strategy Session", day: 0, startHour: 9, duration: 1, status: "confirmed" },
  { id: "a2", clientId: "c2", clientName: "Marcus Weber", serviceId: "s2", service: "Initial Consultation", day: 0, startHour: 11, duration: 1.5, status: "confirmed" },
  { id: "a3", clientId: "c7", clientName: "Fatima Al-Rashid", serviceId: "s5", service: "Architecture Review", day: 0, startHour: 14, duration: 1.5, status: "confirmed" },
  // Tuesday
  { id: "a4", clientId: "c3", clientName: "Aisha Mohammed", serviceId: "s3", service: "Follow-up Review", day: 1, startHour: 10, duration: 1, status: "confirmed" },
  { id: "a5", clientId: "c4", clientName: "Thomas Eriksson", serviceId: "s4", service: "Monthly Consultation", day: 1, startHour: 14, duration: 2, status: "pending" },
  { id: "a6", clientId: "c8", clientName: "Lukas Braun", serviceId: "s2", service: "Initial Consultation", day: 1, startHour: 9, duration: 1.5, status: "confirmed" },
  // Wednesday
  { id: "a7", clientId: "c5", clientName: "Yara Haddad", serviceId: "s5", service: "Architecture Review", day: 2, startHour: 9, duration: 1.5, status: "confirmed" },
  { id: "a8", clientId: "c1", clientName: "Nadia Al-Farsi", serviceId: "s3", service: "Follow-up Review", day: 2, startHour: 15, duration: 1, status: "completed" },
  { id: "a9", clientId: "c9", clientName: "Sara Jensen", serviceId: "s4", service: "Monthly Consultation", day: 2, startHour: 11, duration: 2, status: "confirmed" },
  // Thursday
  { id: "a10", clientId: "c6", clientName: "Daniel Kim", serviceId: "s6", service: "Code Review", day: 3, startHour: 10, duration: 2, status: "pending" },
  { id: "a11", clientId: "c2", clientName: "Marcus Weber", serviceId: "s1", service: "Strategy Session", day: 3, startHour: 14, duration: 1, status: "confirmed" },
  { id: "a12", clientId: "c10", clientName: "Khalid Mansoor", serviceId: "s5", service: "Architecture Review", day: 3, startHour: 16, duration: 1.5, status: "cancelled" },
  // Friday
  { id: "a13", clientId: "c3", clientName: "Aisha Mohammed", serviceId: "s7", service: "Sprint Review", day: 4, startHour: 11, duration: 1, status: "confirmed" },
  { id: "a14", clientId: "c5", clientName: "Yara Haddad", serviceId: "s8", service: "Deployment Support", day: 4, startHour: 15, duration: 1, status: "pending" },
  { id: "a15", clientId: "c7", clientName: "Fatima Al-Rashid", serviceId: "s1", service: "Strategy Session", day: 4, startHour: 9, duration: 1, status: "confirmed" },
  { id: "a16", clientId: "c11", clientName: "Lisa Chen", serviceId: "s3", service: "Follow-up Review", day: 4, startHour: 13, duration: 1, status: "completed" },
  // Saturday
  { id: "a17", clientId: "c4", clientName: "Thomas Eriksson", serviceId: "s6", service: "Code Review", day: 5, startHour: 10, duration: 2, status: "confirmed" },
  // Sunday - empty (day off)
];

// ── Calendar helpers ───────────────────────────────────────────────

export const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const weekDates = ["Mar 16", "Mar 17", "Mar 18", "Mar 19", "Mar 20", "Mar 21", "Mar 22"];
export const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

// ── Stats ──────────────────────────────────────────────────────────

export const stats = {
  totalThisWeek: appointments.filter((a) => a.status !== "cancelled").length,
  confirmed: appointments.filter((a) => a.status === "confirmed").length,
  pending: appointments.filter((a) => a.status === "pending").length,
  completed: appointments.filter((a) => a.status === "completed").length,
  cancelled: appointments.filter((a) => a.status === "cancelled").length,
  clientsThisWeek: new Set(appointments.filter((a) => a.status !== "cancelled").map((a) => a.clientId)).size,
  revenue: appointments
    .filter((a) => a.status === "confirmed" || a.status === "completed")
    .reduce((sum, a) => {
      const svc = services.find((s) => s.id === a.serviceId);
      return sum + (svc?.price ?? 0);
    }, 0),
};

// ── Activity Feed ──────────────────────────────────────────────────

export const activityFeed: ActivityEntry[] = [
  { id: "act1", type: "booked", clientName: "Fatima Al-Rashid", service: "Strategy Session", description: "Fatima Al-Rashid booked a Strategy Session for Friday 9:00 AM", timestamp: "10 min ago", dateGroup: "today" },
  { id: "act2", type: "confirmed", clientName: "Nadia Al-Farsi", service: "Strategy Session", description: "Nadia Al-Farsi confirmed Strategy Session for Monday 9:00 AM", timestamp: "25 min ago", dateGroup: "today" },
  { id: "act3", type: "cancelled", clientName: "Khalid Mansoor", service: "Architecture Review", description: "Khalid Mansoor cancelled Architecture Review for Thursday 4:00 PM", timestamp: "1 hr ago", dateGroup: "today" },
  { id: "act4", type: "completed", clientName: "Lisa Chen", service: "Follow-up Review", description: "Lisa Chen completed Follow-up Review", timestamp: "2 hrs ago", dateGroup: "today" },
  { id: "act5", type: "rescheduled", clientName: "Daniel Kim", service: "Code Review", description: "Daniel Kim rescheduled Code Review from Wednesday to Thursday", timestamp: "3 hrs ago", dateGroup: "today" },
  { id: "act6", type: "booked", clientName: "Sara Jensen", service: "Monthly Consultation", description: "Sara Jensen booked a Monthly Consultation for Wednesday", timestamp: "5 hrs ago", dateGroup: "today" },
  { id: "act7", type: "confirmed", clientName: "Marcus Weber", service: "Initial Consultation", description: "Marcus Weber confirmed Initial Consultation for Monday", timestamp: "Yesterday, 4:30 PM", dateGroup: "yesterday" },
  { id: "act8", type: "booked", clientName: "Yara Haddad", service: "Architecture Review", description: "Yara Haddad booked an Architecture Review for Wednesday", timestamp: "Yesterday, 2:15 PM", dateGroup: "yesterday" },
  { id: "act9", type: "completed", clientName: "Nadia Al-Farsi", service: "Follow-up Review", description: "Nadia Al-Farsi completed Follow-up Review", timestamp: "Yesterday, 11:00 AM", dateGroup: "yesterday" },
  { id: "act10", type: "rescheduled", clientName: "Thomas Eriksson", service: "Monthly Consultation", description: "Thomas Eriksson rescheduled Monthly Consultation to Tuesday", timestamp: "Yesterday, 9:20 AM", dateGroup: "yesterday" },
  { id: "act11", type: "booked", clientName: "Lukas Braun", service: "Initial Consultation", description: "Lukas Braun booked an Initial Consultation for Tuesday", timestamp: "Mon, 3:45 PM", dateGroup: "thisWeek" },
  { id: "act12", type: "cancelled", clientName: "Omar Hassan", service: "Sprint Review", description: "Omar Hassan cancelled Sprint Review — scheduling conflict", timestamp: "Mon, 10:00 AM", dateGroup: "thisWeek" },
  { id: "act13", type: "confirmed", clientName: "Aisha Mohammed", service: "Follow-up Review", description: "Aisha Mohammed confirmed Follow-up Review for Tuesday", timestamp: "Sun, 8:00 PM", dateGroup: "earlier" },
  { id: "act14", type: "booked", clientName: "Fatima Al-Rashid", service: "Architecture Review", description: "Fatima Al-Rashid booked Architecture Review for Monday", timestamp: "Sat, 11:30 AM", dateGroup: "earlier" },
  { id: "act15", type: "completed", clientName: "Thomas Eriksson", service: "Code Review", description: "Thomas Eriksson completed Code Review", timestamp: "Fri, 12:00 PM", dateGroup: "earlier" },
];

// ── Business Hours ─────────────────────────────────────────────────

export const businessHours: BusinessHours[] = [
  { day: "Monday", open: "09:00", close: "18:00", enabled: true },
  { day: "Tuesday", open: "09:00", close: "18:00", enabled: true },
  { day: "Wednesday", open: "09:00", close: "18:00", enabled: true },
  { day: "Thursday", open: "09:00", close: "18:00", enabled: true },
  { day: "Friday", open: "09:00", close: "17:00", enabled: true },
  { day: "Saturday", open: "10:00", close: "14:00", enabled: true },
  { day: "Sunday", open: "00:00", close: "00:00", enabled: false },
];

// ── Sidebar nav ────────────────────────────────────────────────────

export type LumaViewId = "schedule" | "clients" | "services" | "activity" | "settings";

export interface LumaNavItem {
  id: LumaViewId;
  label: string;
  icon: string; // identifier for inline SVG
}

export const navItems: LumaNavItem[] = [
  { id: "schedule", label: "Schedule", icon: "calendar" },
  { id: "clients", label: "Clients", icon: "users" },
  { id: "services", label: "Services", icon: "clock" },
  { id: "activity", label: "Activity", icon: "bell" },
  { id: "settings", label: "Settings", icon: "settings" },
];
