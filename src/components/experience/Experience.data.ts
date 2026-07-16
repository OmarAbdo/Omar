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
    id: "lifeos",
    role: "Co-Founder & Lead Engineer",
    company: "LifeOS Labs",
    location: "Berlin",
    period: "Jan 2025 — Present",
    type: "founder",
    highlights: [
      "Crystal DB: distributed consensus key-value store built from scratch in Go — full Raft (leader election, log replication, crash-safe write-ahead log, snapshot compaction) with a pluggable LSM-tree storage interface, validated by a real multi-node cluster integration suite",
      "Quik: led the full lifecycle (Figma → DevOps) of an AI super-app aggregating 44+ LLMs with Vector + Graph RAG memory",
      "Tafkeer AI: autonomous routing layer across 59 LLMs and specialised assistants — first of its kind in the region, adapted for the Saudi market",
    ],
    tech: ["Go", "PostgreSQL", "React", "Microservices", "Raft", "Vector RAG", "Graph RAG"],
  },
  {
    id: "independent-rnd",
    role: "Independent Software R&D",
    company: "Open-Source",
    location: "Remote / Berlin",
    period: "Oct 2023 — Dec 2024",
    type: "freelance",
    highlights: [
      "Netro: object-oriented Python framework benchmarking hybrid last-mile delivery (autonomous robots + trucks) against traditional methods",
      "Luqman: LSTM recurrent-neural-network trading assistant for automated market analysis and time-series forecasting",
    ],
    tech: ["Python", "LSTM", "NumPy", "Pandas", "DDD"],
  },
  {
    id: "kurnblick",
    role: "Frontend Developer",
    company: "Kurnblick",
    location: "Paderborn",
    period: "Oct 2021 — Sep 2023",
    type: "part-time",
    highlights: [
      "Papenburg's Events: REST API-based event, ticketing & digital payments system enabling the organisation to run more events with fewer resources",
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
      "MacFit: end-to-end gym sales system with recommendation engine and sales-funnel tracking — stepped up as PM; became 3rd most profitable project across the company's 40 international offices",
      "Precision Pricing: forecasting & optimisation engine with ETL for the Royal Bank of Canada",
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
      "Founded a software agency that delivered 12+ projects across 5+ countries",
      "Built Ridee (Flutter cycling-community app), Eonity Pitch Master (Spotify-API music platform), and SunnyWorld (renewable-energy platform)",
    ],
    tech: ["React", "PHP", "Laravel", "Node.js", "Flutter", "MySQL"],
  },
];
