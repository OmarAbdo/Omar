export interface Project {
  id: string;
  href: string;
  stack: string[];
  status: "live" | "open-source" | "private" | "research";
  titleKey: string;
  descKey: string;
  gradient: string;
}

export const projects: Project[] = [
  {
    id: "tafkeer",
    href: "https://tafkeer-ai.com",
    stack: ["React Native", "tRPC", "AWS EKS", "59 AI Models", "Stripe"],
    status: "live",
    titleKey: "home.projects.tafkeer.title",
    descKey: "home.projects.tafkeer.description",
    gradient: "from-amber-500/10 to-orange-600/5",
  },
  {
    id: "gii",
    href: "https://github.com/OmarAbdo/global-investment-intelligence",
    stack: ["Python", "Gemini AI", "DCF Engine", "FastAPI"],
    status: "private",
    titleKey: "home.projects.gii.title",
    descKey: "home.projects.gii.description",
    gradient: "from-blue-500/10 to-indigo-600/5",
  },
  {
    id: "luqman",
    href: "https://github.com/OmarAbdo/Luqman",
    stack: ["Python", "LSTM", "GRU", "CNN", "Attention"],
    status: "open-source",
    titleKey: "home.projects.luqman.title",
    descKey: "home.projects.luqman.description",
    gradient: "from-emerald-500/10 to-green-600/5",
  },
  {
    id: "netro",
    href: "https://github.com/OmarAbdo/Netro",
    stack: ["Python", "Simulation", "Optimisation", "GIS"],
    status: "open-source",
    titleKey: "home.projects.netro.title",
    descKey: "home.projects.netro.description",
    gradient: "from-violet-500/10 to-purple-600/5",
  },
];
