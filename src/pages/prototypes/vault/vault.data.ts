// ─── Types ────────────────────────────────────────────────────────────────────

export type ViewId =
  | "dashboard"
  | "portfolio"
  | "transactions"
  | "accounts"
  | "insights"
  | "advisor"
  | "cards"
  | "transfers"
  | "settings";

export interface Holding {
  id: string;
  name: string;
  ticker: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  allocation: number;
  change24h: number;
  sparkline: number[];
  assetClass: "Equities" | "Fixed Income" | "Alternatives" | "Cash";
  unrealizedPL: number;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  account: string;
  type: "credit" | "debit" | "investment";
  amount: number;
  balance: number;
  category: string;
}

export interface Account {
  id: string;
  name: string;
  type: "current" | "savings" | "investment" | "fixed-deposit";
  balance: number;
  currency: string;
  accountNumber: string;
  iban: string;
  details: Record<string, string>;
}

export interface MarketIndex {
  name: string;
  value: string;
  change: number;
}

export interface Insight {
  id: string;
  date: string;
  title: string;
  category: string;
  summary: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  bank: string;
  accountLast4: string;
  lastTransfer: string;
}

export interface TeamMember {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: string;
}

export interface NavSection {
  label: string;
  items: { id: ViewId; label: string; icon: string }[];
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export const navSections: NavSection[] = [
  {
    label: "Overview",
    items: [{ id: "dashboard", label: "Dashboard", icon: "grid" }],
  },
  {
    label: "Wealth",
    items: [
      { id: "portfolio", label: "Portfolio", icon: "trending-up" },
      { id: "transactions", label: "Transactions", icon: "list" },
      { id: "accounts", label: "Accounts", icon: "wallet" },
    ],
  },
  {
    label: "Advisory",
    items: [
      { id: "insights", label: "Market Insights", icon: "lightbulb" },
      { id: "advisor", label: "Relationship Manager", icon: "user" },
    ],
  },
  {
    label: "Manage",
    items: [
      { id: "cards", label: "Cards", icon: "credit-card" },
      { id: "transfers", label: "Transfers", icon: "send" },
      { id: "settings", label: "Settings", icon: "settings" },
    ],
  },
];

// ─── Portfolio ────────────────────────────────────────────────────────────────

export const portfolioValue = 1247832.45;
export const portfolioChange = 2.34;
export const portfolioDayChange = 28541.12;

export const performanceData = [
  980000, 995000, 1010000, 1005000, 1025000, 1040000, 1035000, 1055000,
  1068000, 1075000, 1090000, 1085000, 1102000, 1118000, 1125000, 1140000,
  1155000, 1148000, 1165000, 1180000, 1195000, 1210000, 1205000, 1220000,
  1235000, 1228000, 1242000, 1247832,
];

export const benchmarkData = [
  980000, 990000, 1000000, 1008000, 1018000, 1025000, 1030000, 1042000,
  1050000, 1055000, 1062000, 1058000, 1070000, 1080000, 1085000, 1095000,
  1105000, 1100000, 1112000, 1120000, 1128000, 1135000, 1130000, 1140000,
  1148000, 1142000, 1150000, 1155000,
];

export const holdings: Holding[] = [
  {
    id: "h1", name: "Apple Inc.", ticker: "AAPL", shares: 450, avgCost: 142.50,
    currentPrice: 178.72, allocation: 32, change24h: 1.24, assetClass: "Equities",
    unrealizedPL: 16299.00,
    sparkline: [165, 168, 170, 172, 169, 174, 176, 173, 177, 178, 175, 178.72],
  },
  {
    id: "h2", name: "Microsoft Corp.", ticker: "MSFT", shares: 280, avgCost: 310.20,
    currentPrice: 415.60, allocation: 24, change24h: 0.87, assetClass: "Equities",
    unrealizedPL: 29512.00,
    sparkline: [395, 400, 405, 402, 408, 410, 407, 412, 414, 410, 413, 415.60],
  },
  {
    id: "h3", name: "NVIDIA Corp.", ticker: "NVDA", shares: 120, avgCost: 480.00,
    currentPrice: 875.30, allocation: 18, change24h: 3.45, assetClass: "Equities",
    unrealizedPL: 47436.00,
    sparkline: [820, 835, 845, 840, 855, 860, 850, 865, 870, 862, 872, 875.30],
  },
  {
    id: "h4", name: "Berkshire Hathaway", ticker: "BRK.B", shares: 95, avgCost: 345.80,
    currentPrice: 412.50, allocation: 10, change24h: -0.32, assetClass: "Equities",
    unrealizedPL: 6336.50,
    sparkline: [405, 408, 410, 412, 410, 414, 413, 411, 415, 413, 414, 412.50],
  },
  {
    id: "h5", name: "iShares MSCI UAE", ticker: "UAE", shares: 800, avgCost: 14.20,
    currentPrice: 16.85, allocation: 4, change24h: 0.56, assetClass: "Equities",
    unrealizedPL: 2120.00,
    sparkline: [15.2, 15.5, 15.8, 16.0, 15.9, 16.2, 16.4, 16.1, 16.5, 16.7, 16.6, 16.85],
  },
  {
    id: "h6", name: "Gold ETF (GLD)", ticker: "GLD", shares: 150, avgCost: 180.50,
    currentPrice: 198.40, allocation: 4, change24h: 0.15, assetClass: "Alternatives",
    unrealizedPL: 2685.00,
    sparkline: [190, 192, 194, 193, 195, 196, 194, 197, 198, 196, 197, 198.40],
  },
  {
    id: "h7", name: "US Treasury Bond ETF", ticker: "TLT", shares: 200, avgCost: 98.50,
    currentPrice: 102.30, allocation: 4, change24h: -0.12, assetClass: "Fixed Income",
    unrealizedPL: 760.00,
    sparkline: [99, 100, 101, 100.5, 101.2, 101.8, 101.5, 102, 102.3, 101.8, 102.1, 102.30],
  },
  {
    id: "h8", name: "Vanguard Total Bond", ticker: "BND", shares: 300, avgCost: 72.10,
    currentPrice: 74.20, allocation: 4, change24h: 0.08, assetClass: "Fixed Income",
    unrealizedPL: 630.00,
    sparkline: [72, 72.5, 73, 73.2, 73.5, 73.8, 73.5, 74, 74.1, 73.9, 74.1, 74.20],
  },
];

export const allocationGroups = [
  { label: "US Equities", pct: 64, color: "#C9A96E" },
  { label: "Emerging Markets", pct: 8, color: "#B8924A" },
  { label: "Fixed Income", pct: 8, color: "#7C6F5B" },
  { label: "Alternatives", pct: 4, color: "#5C5347" },
  { label: "Cash", pct: 16, color: "#3A3530" },
];

export const riskMetrics = {
  riskScore: "Moderate-Aggressive",
  riskLevel: 72,
  sharpeRatio: 1.42,
  beta: 1.15,
  volatility: 18.3,
  currencyExposure: [
    { currency: "USD", pct: 65 },
    { currency: "EUR", pct: 20 },
    { currency: "AED", pct: 15 },
  ],
};

// ─── Accounts ─────────────────────────────────────────────────────────────────

export const accounts: Account[] = [
  {
    id: "acc1", name: "Current Account", type: "current", balance: 184520.00,
    currency: "USD", accountNumber: "****4821",
    iban: "AE07 0331 2345 6789 0012 345",
    details: { "Last Transaction": "Mar 20, 2026", "Monthly Avg": "$12,400" },
  },
  {
    id: "acc2", name: "Savings Account", type: "savings", balance: 312000.00,
    currency: "USD", accountNumber: "****7293",
    iban: "AE07 0331 2345 6789 0012 678",
    details: { "Interest Rate": "3.2% p.a.", "Interest Earned (YTD)": "$2,496" },
  },
  {
    id: "acc3", name: "Investment Account", type: "investment", balance: 1247832.45,
    currency: "USD", accountNumber: "****1056",
    iban: "AE07 0331 2345 6789 0012 901",
    details: { "YTD Return": "+12.4%", "Holdings": "8 positions" },
  },
  {
    id: "acc4", name: "Fixed Deposit", type: "fixed-deposit", balance: 500000.00,
    currency: "USD", accountNumber: "****3847",
    iban: "AE07 0331 2345 6789 0013 234",
    details: { "Rate": "4.8% p.a.", "Maturity": "Sep 15, 2026", "Auto-Renew": "Enabled" },
  },
];

export const totalNetWorth = accounts.reduce((sum, a) => sum + a.balance, 0);

// ─── Transactions ─────────────────────────────────────────────────────────────

export const transactions: Transaction[] = [
  { id: "t1", date: "Mar 20, 2026", description: "Dividend — AAPL", account: "Investment", type: "credit", amount: 1240.00, balance: 1249072.45, category: "Dividend" },
  { id: "t2", date: "Mar 19, 2026", description: "Transfer to Savings", account: "Current", type: "debit", amount: -10000.00, balance: 184520.00, category: "Transfer" },
  { id: "t3", date: "Mar 18, 2026", description: "Salary — Acme Corp", account: "Current", type: "credit", amount: 18500.00, balance: 194520.00, category: "Income" },
  { id: "t4", date: "Mar 15, 2026", description: "Buy — 20 MSFT", account: "Investment", type: "investment", amount: -8312.00, balance: 1247832.45, category: "Trade" },
  { id: "t5", date: "Mar 14, 2026", description: "DEWA Utilities", account: "Current", type: "debit", amount: -1850.00, balance: 176020.00, category: "Utilities" },
  { id: "t6", date: "Mar 12, 2026", description: "Du Telecom", account: "Current", type: "debit", amount: -420.00, balance: 177870.00, category: "Utilities" },
  { id: "t7", date: "Mar 10, 2026", description: "Dividend — MSFT", account: "Investment", type: "credit", amount: 840.00, balance: 1256144.45, category: "Dividend" },
  { id: "t8", date: "Mar 8, 2026", description: "Carrefour MAF", account: "Current", type: "debit", amount: -632.50, balance: 178290.00, category: "Shopping" },
  { id: "t9", date: "Mar 7, 2026", description: "Rent — Marina Tower", account: "Current", type: "debit", amount: -15000.00, balance: 178922.50, category: "Rent" },
  { id: "t10", date: "Mar 5, 2026", description: "Buy — 50 GLD", account: "Investment", type: "investment", amount: -9920.00, balance: 1255304.45, category: "Trade" },
  { id: "t11", date: "Mar 3, 2026", description: "Salik Top-up", account: "Current", type: "debit", amount: -200.00, balance: 193922.50, category: "Transport" },
  { id: "t12", date: "Mar 1, 2026", description: "Fixed Deposit Interest", account: "Fixed Deposit", type: "credit", amount: 2000.00, balance: 502000.00, category: "Interest" },
  { id: "t13", date: "Feb 28, 2026", description: "Nol Card Recharge", account: "Current", type: "debit", amount: -100.00, balance: 194122.50, category: "Transport" },
  { id: "t14", date: "Feb 26, 2026", description: "Amazon.ae", account: "Current", type: "debit", amount: -1245.00, balance: 194222.50, category: "Shopping" },
  { id: "t15", date: "Feb 25, 2026", description: "Dividend — BRK.B", account: "Investment", type: "credit", amount: 380.00, balance: 1265224.45, category: "Dividend" },
  { id: "t16", date: "Feb 22, 2026", description: "Transfer from Current", account: "Savings", type: "credit", amount: 5000.00, balance: 312000.00, category: "Transfer" },
];

export const transactionSummary = {
  totalIn: 22960.00,
  totalOut: 47679.50,
  net: -24719.50,
};

// ─── Market Indices ───────────────────────────────────────────────────────────

export const marketIndices: MarketIndex[] = [
  { name: "S&P 500", value: "5,218.42", change: 0.68 },
  { name: "FTSE 100", value: "7,934.15", change: -0.23 },
  { name: "Gold", value: "$2,184.30", change: 1.12 },
  { name: "USD/AED", value: "3.6725", change: 0.01 },
];

// ─── Insights ─────────────────────────────────────────────────────────────────

export const insights: Insight[] = [
  {
    id: "i1",
    date: "Mar 19, 2026",
    title: "UAE Banking Sector: Q1 Outlook",
    category: "Equities",
    summary: "Strong consumer lending growth expected as Dubai real estate demand continues. FAB and Emirates NBD remain overweight in our model portfolios.",
  },
  {
    id: "i2",
    date: "Mar 15, 2026",
    title: "Gold Allocation Review",
    category: "Commodities",
    summary: "With Fed rate expectations shifting, consider increasing gold allocation from 4% to 8%. Geopolitical risk premium remains elevated through H1.",
  },
  {
    id: "i3",
    date: "Mar 10, 2026",
    title: "Fixed Income: Duration Strategy",
    category: "Fixed Income",
    summary: "With the yield curve normalising, we recommend extending duration in investment-grade bonds. Target 5-7 year maturities for optimal risk-adjusted returns.",
  },
  {
    id: "i4",
    date: "Mar 5, 2026",
    title: "Tech Sector Earnings Preview",
    category: "Equities",
    summary: "AI infrastructure spending continues to drive NVDA and MSFT earnings above consensus. Maintain overweight position in US mega-cap tech through Q2.",
  },
];

// ─── Advisor ──────────────────────────────────────────────────────────────────

export const advisor = {
  name: "Sarah Chen",
  title: "Senior Relationship Manager",
  phone: "+971 4 123 4567",
  email: "s.chen@vault-banking.ae",
  office: "DIFC Gate Village, Tower 3",
  nextMeeting: "Mar 28, 2026 — 10:00 AM",
  messages: [
    {
      id: "m1",
      date: "Mar 18, 2026",
      preview: "Hi Omar, I've reviewed your Q1 allocations and have a few suggestions regarding your fixed income exposure. Would you like to discuss on Thursday?",
    },
    {
      id: "m2",
      date: "Mar 12, 2026",
      preview: "Your fixed deposit will mature on September 15th. I recommend we discuss renewal options and potentially allocate a portion toward our new sukuk offering.",
    },
    {
      id: "m3",
      date: "Mar 5, 2026",
      preview: "Monthly statement for February is ready. Portfolio performed +1.8% vs benchmark +1.2%. Full report attached.",
    },
  ],
};

// ─── Cards ────────────────────────────────────────────────────────────────────

export const cardData = {
  cardNumber: "•••• •••• •••• 4821",
  cardHolder: "OMAR ABDO",
  expiry: "09/28",
  type: "Visa Infinite" as const,
  status: "active" as const,
  dailyLimit: 25000,
  monthlySpend: 8420,
  monthlyLimit: 50000,
  recentTransactions: [
    { description: "Emirates Lounge — DXB", amount: -320.00, date: "Mar 20" },
    { description: "Nammos Dubai", amount: -1850.00, date: "Mar 18" },
    { description: "Apple Store — Dubai Mall", amount: -2499.00, date: "Mar 15" },
    { description: "Careem Ride", amount: -45.00, date: "Mar 14" },
    { description: "Waitrose — JBR", amount: -210.00, date: "Mar 13" },
  ],
};

// ─── Transfers ────────────────────────────────────────────────────────────────

export const beneficiaries: Beneficiary[] = [
  { id: "b1", name: "Ahmed Al Maktoum", bank: "Emirates NBD", accountLast4: "7821", lastTransfer: "Mar 10, 2026" },
  { id: "b2", name: "Fatima Hassan", bank: "ADCB", accountLast4: "3456", lastTransfer: "Feb 28, 2026" },
  { id: "b3", name: "Tech Solutions LLC", bank: "Mashreq Bank", accountLast4: "9012", lastTransfer: "Feb 15, 2026" },
];

export const recentTransfers = [
  { id: "rt1", to: "Ahmed Al Maktoum", amount: 5000, date: "Mar 10, 2026", status: "completed" as const },
  { id: "rt2", to: "Tech Solutions LLC", amount: 12000, date: "Feb 15, 2026", status: "completed" as const },
  { id: "rt3", to: "Fatima Hassan", amount: 3000, date: "Feb 28, 2026", status: "completed" as const },
  { id: "rt4", to: "Ahmed Al Maktoum", amount: 7500, date: "Mar 25, 2026", status: "scheduled" as const },
];

// ─── Settings ─────────────────────────────────────────────────────────────────

export const settingsData = {
  profile: {
    name: "Omar Abdo",
    email: "omar@vault-banking.ae",
    phone: "+971 50 123 4567",
    lastLogin: "Mar 21, 2026 — 09:14 AM",
  },
  team: [
    { id: "tm1", name: "Sarah Chen", initials: "SC", email: "s.chen@vault-banking.ae", role: "Relationship Manager" },
    { id: "tm2", name: "James Liu", initials: "JL", email: "j.liu@vault-banking.ae", role: "Investment Analyst" },
    { id: "tm3", name: "Aisha Khalid", initials: "AK", email: "a.khalid@vault-banking.ae", role: "Compliance Officer" },
  ] as TeamMember[],
};

// ─── Dashboard quick actions ──────────────────────────────────────────────────

export const recentActivity = transactions.slice(0, 5);

export const advisorNote = {
  text: "Your Q1 portfolio review is scheduled for March 28. We'll discuss rebalancing and the new sukuk offering.",
  author: "Sarah Chen",
  role: "Relationship Manager",
};
