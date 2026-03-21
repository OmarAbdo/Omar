import type { ViewId } from "./hooks/usePulseState";

// ─── Nav ───────────────────────────────────────────────
export interface NavItem {
  icon: string;
  label: string;
  view: ViewId;
  section: "analytics" | "configure";
}

export const navItems: NavItem[] = [
  { icon: "chart", label: "Overview", view: "overview", section: "analytics" },
  { icon: "activity", label: "Realtime", view: "realtime", section: "analytics" },
  { icon: "users", label: "Audience", view: "audience", section: "analytics" },
  { icon: "cursor", label: "Acquisition", view: "acquisition", section: "analytics" },
  { icon: "code", label: "Events", view: "events", section: "analytics" },
  { icon: "cog", label: "Settings", view: "settings", section: "configure" },
];

// ─── View titles ───────────────────────────────────────
export const viewTitles: Record<ViewId, { title: string; subtitle: string }> = {
  overview: { title: "Overview", subtitle: "Key metrics at a glance" },
  realtime: { title: "Realtime", subtitle: "Live visitor activity" },
  audience: { title: "Audience", subtitle: "Who your users are" },
  acquisition: { title: "Acquisition", subtitle: "How users find you" },
  events: { title: "Events", subtitle: "What users do" },
  settings: { title: "Settings", subtitle: "Dashboard configuration" },
};

// ─── KPIs ──────────────────────────────────────────────
export interface Kpi {
  label: string;
  value: string;
  rawValue: number;
  change: string;
  changeType: "positive" | "negative";
  sparkline: number[];
}

export const kpis: Kpi[] = [
  {
    label: "Revenue",
    value: "$48,295",
    rawValue: 48295,
    change: "12.5%",
    changeType: "positive",
    sparkline: [28, 32, 35, 30, 42, 38, 45, 50, 48, 55, 52, 60],
  },
  {
    label: "Active Users",
    value: "12,847",
    rawValue: 12847,
    change: "8.2%",
    changeType: "positive",
    sparkline: [80, 85, 82, 90, 88, 95, 92, 98, 100, 105, 110, 108],
  },
  {
    label: "Conversion",
    value: "3.24%",
    rawValue: 3.24,
    change: "0.8%",
    changeType: "positive",
    sparkline: [2.1, 2.3, 2.5, 2.4, 2.8, 2.6, 3.0, 2.9, 3.1, 3.0, 3.2, 3.24],
  },
  {
    label: "Bounce Rate",
    value: "42.1%",
    rawValue: 42.1,
    change: "2.3%",
    changeType: "negative",
    sparkline: [38, 40, 39, 41, 43, 42, 44, 43, 45, 44, 43, 42],
  },
];

export const kpisPreviousPeriod: Kpi[] = [
  { label: "Revenue", value: "$42,910", rawValue: 42910, change: "", changeType: "positive", sparkline: [] },
  { label: "Active Users", value: "11,872", rawValue: 11872, change: "", changeType: "positive", sparkline: [] },
  { label: "Conversion", value: "2.98%", rawValue: 2.98, change: "", changeType: "positive", sparkline: [] },
  { label: "Bounce Rate", value: "39.8%", rawValue: 39.8, change: "", changeType: "negative", sparkline: [] },
];

// ─── Charts ────────────────────────────────────────────
export const revenueData = [
  12400, 15200, 13800, 18600, 16200, 21400, 19800, 24600, 22100, 28300, 25800, 31200,
  28900, 34100, 32600, 38400, 35200, 41800, 38600, 44200, 41900, 48295,
];

export const revenuePreviousData = [
  10200, 12800, 11900, 15400, 13800, 18200, 16400, 20100, 18600, 23800, 21400, 26100,
  24200, 28600, 27100, 32200, 29800, 35100, 32400, 37800, 35600, 42910,
];

export const sessionsData = [
  3200, 3800, 3500, 4100, 3900, 4600, 4200, 5100, 4800, 5400, 5100, 5800,
  5500, 6200, 5900, 6800, 6400, 7200, 6800, 7600, 7200, 8100,
];

export const chartLabels = [
  "Mar 1", "Mar 2", "Mar 3", "Mar 4", "Mar 5", "Mar 6", "Mar 7", "Mar 8",
  "Mar 9", "Mar 10", "Mar 11", "Mar 12", "Mar 13", "Mar 14", "Mar 15", "Mar 16",
  "Mar 17", "Mar 18", "Mar 19", "Mar 20", "Mar 21", "Mar 22",
];

// ─── Traffic sources ───────────────────────────────────
export const channelData = [
  { label: "Organic Search", value: 4521, pct: 38 },
  { label: "Direct", value: 2847, pct: 24 },
  { label: "Social Media", value: 1923, pct: 16 },
  { label: "Email", value: 1456, pct: 12 },
  { label: "Referral", value: 1100, pct: 10 },
];

// ─── Top pages ─────────────────────────────────────────
export const topPages = [
  { path: "/dashboard", views: 14523, change: "+12%", bounceRate: "32%" },
  { path: "/pricing", views: 8721, change: "+28%", bounceRate: "45%" },
  { path: "/features", views: 6432, change: "+5%", bounceRate: "38%" },
  { path: "/blog/ai-trends", views: 4210, change: "+45%", bounceRate: "22%" },
  { path: "/signup", views: 3842, change: "+18%", bounceRate: "51%" },
  { path: "/docs/api", views: 3210, change: "+8%", bounceRate: "28%" },
  { path: "/about", views: 2891, change: "-3%", bounceRate: "55%" },
  { path: "/blog/react-tips", views: 2450, change: "+32%", bounceRate: "25%" },
];

// ─── Audience data ─────────────────────────────────────
export interface CountryRow {
  country: string;
  code: string;
  flag: string;
  users: number;
  sessions: number;
  bounceRate: number;
  avgDuration: string;
}

export const audienceByCountry: CountryRow[] = [
  { country: "United States", code: "US", flag: "🇺🇸", users: 4521, sessions: 8234, bounceRate: 38.2, avgDuration: "3:42" },
  { country: "Germany", code: "DE", flag: "🇩🇪", users: 2103, sessions: 3891, bounceRate: 42.1, avgDuration: "2:58" },
  { country: "United Kingdom", code: "GB", flag: "🇬🇧", users: 1842, sessions: 3210, bounceRate: 35.8, avgDuration: "3:15" },
  { country: "France", code: "FR", flag: "🇫🇷", users: 1204, sessions: 2105, bounceRate: 44.3, avgDuration: "2:42" },
  { country: "Canada", code: "CA", flag: "🇨🇦", users: 982, sessions: 1756, bounceRate: 39.1, avgDuration: "3:08" },
  { country: "India", code: "IN", flag: "🇮🇳", users: 876, sessions: 1542, bounceRate: 48.2, avgDuration: "2:21" },
  { country: "Brazil", code: "BR", flag: "🇧🇷", users: 654, sessions: 1120, bounceRate: 41.5, avgDuration: "2:55" },
  { country: "Japan", code: "JP", flag: "🇯🇵", users: 521, sessions: 892, bounceRate: 36.4, avgDuration: "3:28" },
  { country: "Australia", code: "AU", flag: "🇦🇺", users: 445, sessions: 782, bounceRate: 37.9, avgDuration: "3:05" },
  { country: "Netherlands", code: "NL", flag: "🇳🇱", users: 398, sessions: 685, bounceRate: 40.2, avgDuration: "2:48" },
  { country: "UAE", code: "AE", flag: "🇦🇪", users: 342, sessions: 610, bounceRate: 43.1, avgDuration: "2:35" },
  { country: "Spain", code: "ES", flag: "🇪🇸", users: 289, sessions: 498, bounceRate: 45.6, avgDuration: "2:22" },
  { country: "South Korea", code: "KR", flag: "🇰🇷", users: 234, sessions: 412, bounceRate: 34.8, avgDuration: "3:32" },
  { country: "Sweden", code: "SE", flag: "🇸🇪", users: 198, sessions: 342, bounceRate: 38.5, avgDuration: "3:12" },
];

export interface DeviceRow { device: string; users: number; pct: number; }
export const audienceByDevice: DeviceRow[] = [
  { device: "Desktop", users: 7234, pct: 56 },
  { device: "Mobile", users: 4102, pct: 32 },
  { device: "Tablet", users: 1511, pct: 12 },
];

export interface BrowserRow { browser: string; users: number; pct: number; color: string; }
export const audienceByBrowser: BrowserRow[] = [
  { browser: "Chrome", users: 6821, pct: 53, color: "#3B82F6" },
  { browser: "Safari", users: 3210, pct: 25, color: "#06B6D4" },
  { browser: "Firefox", users: 1542, pct: 12, color: "#F59E0B" },
  { browser: "Edge", users: 1274, pct: 10, color: "#8B5CF6" },
];

export const audienceNewVsReturning = { new: 58, returning: 42 };

export const hourlyActivity = [
  12, 8, 5, 3, 4, 8, 15, 28, 42, 55, 62, 58,
  51, 48, 52, 55, 60, 58, 45, 38, 30, 25, 20, 15,
];

// ─── Acquisition data ──────────────────────────────────
export interface AcquisitionChannel {
  channel: string;
  users: number;
  newUsers: number;
  sessions: number;
  bounceRate: number;
  convRate: number;
  revenue: string;
}

export const acquisitionChannels: AcquisitionChannel[] = [
  { channel: "Organic Search", users: 4521, newUsers: 2810, sessions: 8234, bounceRate: 38, convRate: 3.8, revenue: "$18,240" },
  { channel: "Direct", users: 2847, newUsers: 1240, sessions: 4891, bounceRate: 42, convRate: 2.9, revenue: "$11,420" },
  { channel: "Social Media", users: 1923, newUsers: 1580, sessions: 3210, bounceRate: 52, convRate: 1.8, revenue: "$5,890" },
  { channel: "Email", users: 1456, newUsers: 420, sessions: 2845, bounceRate: 28, convRate: 5.2, revenue: "$8,920" },
  { channel: "Referral", users: 1100, newUsers: 680, sessions: 1920, bounceRate: 35, convRate: 3.1, revenue: "$3,825" },
  { channel: "Paid Search", users: 890, newUsers: 720, sessions: 1540, bounceRate: 45, convRate: 4.1, revenue: "$6,210" },
  { channel: "Display Ads", users: 420, newUsers: 380, sessions: 680, bounceRate: 58, convRate: 1.2, revenue: "$1,840" },
];

export interface Referrer { domain: string; sessions: number; pct: number; }
export const acquisitionReferrers: Referrer[] = [
  { domain: "google.com", sessions: 4210, pct: 35 },
  { domain: "twitter.com", sessions: 1820, pct: 15 },
  { domain: "github.com", sessions: 1450, pct: 12 },
  { domain: "linkedin.com", sessions: 1200, pct: 10 },
  { domain: "reddit.com", sessions: 980, pct: 8 },
  { domain: "producthunt.com", sessions: 720, pct: 6 },
  { domain: "medium.com", sessions: 540, pct: 5 },
  { domain: "dev.to", sessions: 420, pct: 3 },
  { domain: "hackernews", sessions: 380, pct: 3 },
  { domain: "Other", sessions: 360, pct: 3 },
];

export interface Campaign {
  name: string;
  source: string;
  medium: string;
  users: number;
  conversions: number;
  revenue: string;
}

export const acquisitionCampaigns: Campaign[] = [
  { name: "Spring Sale 2024", source: "Email", medium: "newsletter", users: 1240, conversions: 89, revenue: "$4,210" },
  { name: "Product Launch", source: "Social", medium: "twitter", users: 980, conversions: 42, revenue: "$2,840" },
  { name: "Brand Awareness Q1", source: "Display", medium: "banner", users: 2100, conversions: 28, revenue: "$1,920" },
  { name: "Retargeting - Cart", source: "Display", medium: "retarget", users: 450, conversions: 62, revenue: "$3,180" },
  { name: "Developer Outreach", source: "Email", medium: "drip", users: 680, conversions: 38, revenue: "$2,450" },
  { name: "SEO Content Push", source: "Organic", medium: "blog", users: 3200, conversions: 95, revenue: "$5,120" },
];

// ─── Events data ───────────────────────────────────────
export interface EventType {
  name: string;
  count: number;
  usersTriggered: number;
  trend: number[];
}

export const eventTypes: EventType[] = [
  { name: "page_view", count: 48210, usersTriggered: 12847, trend: [3200, 3400, 3100, 3600, 3800, 4200, 3900, 4500, 4100, 4800, 4600, 5100] },
  { name: "button_click", count: 12450, usersTriggered: 8210, trend: [800, 900, 850, 1100, 1050, 1200, 1150, 1300, 1250, 1400, 1350, 1500] },
  { name: "form_submit", count: 3842, usersTriggered: 2810, trend: [240, 280, 260, 320, 310, 380, 350, 400, 380, 420, 410, 450] },
  { name: "purchase", count: 1245, usersTriggered: 1102, trend: [60, 72, 68, 85, 90, 105, 98, 120, 115, 135, 128, 142] },
  { name: "scroll_depth_75", count: 8920, usersTriggered: 6420, trend: [580, 620, 600, 720, 700, 810, 780, 880, 850, 940, 910, 1020] },
  { name: "video_play", count: 2840, usersTriggered: 2105, trend: [180, 200, 190, 240, 230, 280, 260, 310, 290, 340, 320, 370] },
  { name: "file_download", count: 1680, usersTriggered: 1420, trend: [100, 120, 110, 145, 140, 165, 155, 180, 175, 200, 190, 215] },
  { name: "error", count: 342, usersTriggered: 289, trend: [42, 38, 35, 28, 32, 25, 22, 18, 20, 15, 12, 10] },
];

export const eventTimelineData = [
  4200, 4800, 4500, 5200, 5000, 5800, 5400, 6200, 5800, 6600, 6200, 7000,
  6600, 7400, 7000, 7800, 7400, 8200, 7800, 8600, 8200, 9100,
];

// ─── Realtime data ─────────────────────────────────────
export const realtimeInitialVisitors = 247;

export const realtimeInitialPageViews = [
  12, 18, 15, 22, 19, 25, 21, 28, 24, 30,
  27, 32, 29, 35, 31, 38, 34, 40, 36, 42,
];

export interface RealtimeEvent {
  id: number;
  time: string;
  event: string;
  page: string;
  country: string;
  flag: string;
  device: string;
}

export const realtimeEventPool: Omit<RealtimeEvent, "id" | "time">[] = [
  { event: "page_view", page: "/pricing", country: "US", flag: "🇺🇸", device: "Desktop" },
  { event: "button_click", page: "/features", country: "DE", flag: "🇩🇪", device: "Mobile" },
  { event: "page_view", page: "/dashboard", country: "GB", flag: "🇬🇧", device: "Desktop" },
  { event: "form_submit", page: "/contact", country: "FR", flag: "🇫🇷", device: "Desktop" },
  { event: "purchase", page: "/checkout", country: "US", flag: "🇺🇸", device: "Desktop" },
  { event: "page_view", page: "/blog/ai-trends", country: "IN", flag: "🇮🇳", device: "Mobile" },
  { event: "scroll_depth_75", page: "/features", country: "CA", flag: "🇨🇦", device: "Desktop" },
  { event: "button_click", page: "/pricing", country: "JP", flag: "🇯🇵", device: "Mobile" },
  { event: "page_view", page: "/docs/api", country: "BR", flag: "🇧🇷", device: "Desktop" },
  { event: "file_download", page: "/resources", country: "AU", flag: "🇦🇺", device: "Desktop" },
  { event: "page_view", page: "/signup", country: "NL", flag: "🇳🇱", device: "Mobile" },
  { event: "video_play", page: "/demo", country: "AE", flag: "🇦🇪", device: "Desktop" },
  { event: "button_click", page: "/dashboard", country: "SE", flag: "🇸🇪", device: "Desktop" },
  { event: "page_view", page: "/careers", country: "ES", flag: "🇪🇸", device: "Mobile" },
  { event: "form_submit", page: "/signup", country: "KR", flag: "🇰🇷", device: "Desktop" },
];

export const realtimeTopPages = [
  { path: "/dashboard", activeUsers: 42 },
  { path: "/pricing", activeUsers: 28 },
  { path: "/features", activeUsers: 24 },
  { path: "/blog/ai-trends", activeUsers: 19 },
  { path: "/docs/api", activeUsers: 16 },
  { path: "/signup", activeUsers: 14 },
  { path: "/about", activeUsers: 11 },
  { path: "/blog/react-tips", activeUsers: 9 },
];

// ─── Notifications ─────────────────────────────────────
export interface Notification {
  id: number;
  type: "alert" | "milestone" | "report";
  title: string;
  desc: string;
  time: string;
  unread: boolean;
}

export const notifications: Notification[] = [
  { id: 1, type: "alert", title: "Traffic spike detected", desc: "+42% visitors in the last hour", time: "5m ago", unread: true },
  { id: 2, type: "milestone", title: "Revenue milestone", desc: "Monthly revenue exceeded $45K", time: "2h ago", unread: true },
  { id: 3, type: "report", title: "Weekly report ready", desc: "Your analytics summary is available", time: "1d ago", unread: false },
  { id: 4, type: "alert", title: "High bounce rate", desc: "/signup page bounce rate above 50%", time: "3d ago", unread: false },
];

// ─── Settings data ─────────────────────────────────────
export interface TeamMember {
  name: string;
  email: string;
  role: string;
  status: "active" | "invited";
  avatar: string;
}

export const teamMembers: TeamMember[] = [
  { name: "Omar Abdo", email: "omar@pulse.io", role: "Owner", status: "active", avatar: "OA" },
  { name: "Sarah Chen", email: "sarah@pulse.io", role: "Admin", status: "active", avatar: "SC" },
  { name: "Marcus Weber", email: "marcus@pulse.io", role: "Viewer", status: "invited", avatar: "MW" },
];

// ─── Segments ──────────────────────────────────────────
export const segments = ["All Users", "New Users", "Returning", "Mobile", "Desktop"];
