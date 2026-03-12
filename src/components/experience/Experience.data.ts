export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  type: "full-time" | "part-time" | "freelance" | "founder";
  highlights: string[];
  impact?: string; // bold business number
  tech: string[];
}

export const experiences: ExperienceItem[] = [
  {
    id: "self-employed",
    role: "Founder & Full-Stack Developer",
    company: "Tafkeer",
    location: "Berlin",
    period: "Jan 2026 — Present",
    type: "founder",
    highlights: [
      "Building Tafkeer — Arabic-first AI SaaS with 59 models via OpenRouter, React Native, tRPC, AWS EKS",
    ],
    tech: ["React Native", "tRPC", "AWS EKS", "OpenRouter", "Stripe"],
  },
  {
    id: "lifeos",
    role: "CTO & Co-founder",
    company: "LifeOS Labs",
    location: "Berlin",
    period: "Jan 2025 — Sep 2025",
    type: "full-time",
    highlights: [
      "Led full software cycle (Figma → DevOps) for Quik — an AI super app with 44+ models and Vector + Graph RAG memory",
      "Acted as backend architect and engineering lead",
    ],
    tech: ["Go", "PostgreSQL", "React", "Microservices", "Vector RAG", "Graph RAG"],
  },
  {
    id: "github-oss",
    role: "Senior Developer (Open-Source)",
    company: "GitHub",
    location: "Remote",
    period: "Oct 2023 — Feb 2025",
    type: "part-time",
    highlights: [
      "Luqman: LSTM AI trading assistant for advanced market analysis",
      "Netro: Python simulation of hybrid last-mile delivery (trucks + robots)",
      "Rita: LLM-driven job search automation (GoLang + Next.js)",
    ],
    tech: ["Python", "LSTM", "GoLang", "Next.js", "NumPy", "Pandas"],
  },
  {
    id: "zen-admin",
    role: "Technical Product Manager",
    company: "Zen Admin",
    location: "Berlin",
    period: "Jun 2023 — Sep 2023",
    type: "part-time",
    impact: "30% HR cost reduction",
    highlights: [
      "ZAP: Multi-tenant Employee IT Operations & Security SaaS — reduced HR overhead by 30% per tenant",
    ],
    tech: ["Node.js", "React.js"],
  },
  {
    id: "kurnblick",
    role: "Frontend Developer",
    company: "Kurnblick",
    location: "Paderborn",
    period: "Oct 2021 — Apr 2023",
    type: "part-time",
    highlights: [
      "Papenburg's Events: REST API-based ticketing & digital payments platform enabling more events with fewer resources",
    ],
    tech: ["Vue.js", "Nuxt.js", "TypeScript"],
  },
  {
    id: "simon-kucher",
    role: "Backend Developer",
    company: "Simon Kucher",
    location: "Bonn",
    period: "Aug 2019 — Apr 2022",
    type: "full-time",
    impact: "#3 of 40 global offices",
    highlights: [
      "MacFit: End-to-end gym sales system with recommendation engine — became 3rd most profitable of 40 international offices",
      "Precision Pricing: Forecasting & optimisation ETL for the Royal Bank of Canada",
    ],
    tech: ["Node.js", "Vue.js", "PostgreSQL", "Docker", "Python"],
  },
  {
    id: "code-netro",
    role: "Founder & Full-Stack Developer",
    company: "Code Netro",
    location: "Remote",
    period: "Jan 2016 — Jul 2019",
    type: "founder",
    impact: "12 projects · 5 countries",
    highlights: [
      "Founded software agency delivering 12+ projects across 5 countries",
      "Built Ridee (Flutter cycling app), Eonity Pitch Master (Spotify-based), SunnyWorld (renewable energy platform)",
    ],
    tech: ["React", "PHP", "Laravel", "Node.js", "Flutter", "MySQL"],
  },
];
