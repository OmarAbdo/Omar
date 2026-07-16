export interface Project {
  id: string;
  href: string;
  stack: string[];
  status: "live" | "open-source" | "private" | "research" | "prototype";
  titleKey: string;
  descKey: string;
  gradient: string;
  internal?: boolean;
}

export const projects: Project[] = [
  {
    id: "crystal",
    href: "https://github.com/OmarAbdo/Crystal",
    stack: ["Go", "Raft", "Write-Ahead Log", "Snapshots", "LSM-Tree"],
    status: "open-source",
    titleKey: "home.projects.crystal.title",
    descKey: "home.projects.crystal.description",
    gradient: "from-sky-500/10 to-blue-600/5",
  },
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
    id: "quik",
    href: "https://www.linkedin.com/in/omar-abdo/",
    stack: ["Go", "PostgreSQL", "Microservices", "Vector RAG", "Graph RAG"],
    status: "private",
    titleKey: "home.projects.quik.title",
    descKey: "home.projects.quik.description",
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
];

export const prototypeProjects: Project[] = [
  {
    id: "pulse",
    href: "/prototypes/pulse",
    stack: ["React", "TypeScript", "Tailwind CSS", "SVG Charts"],
    status: "prototype",
    titleKey: "home.projects.pulse.title",
    descKey: "home.projects.pulse.description",
    gradient: "from-blue-500/10 to-cyan-600/5",
    internal: true,
  },
  {
    id: "vault",
    href: "/prototypes/vault",
    stack: ["React", "TypeScript", "Framer Motion", "Playfair Display"],
    status: "prototype",
    titleKey: "home.projects.vault.title",
    descKey: "home.projects.vault.description",
    gradient: "from-amber-500/10 to-yellow-600/5",
    internal: true,
  },
  {
    id: "arrow",
    href: "/prototypes/arrow",
    stack: ["React", "TypeScript", "Tailwind CSS", "Real-time UI"],
    status: "prototype",
    titleKey: "home.projects.arrow.title",
    descKey: "home.projects.arrow.description",
    gradient: "from-emerald-500/10 to-green-600/5",
    internal: true,
  },
  {
    id: "luma",
    href: "/prototypes/luma",
    stack: ["React", "TypeScript", "DM Sans", "Calendar UI"],
    status: "prototype",
    titleKey: "home.projects.luma.title",
    descKey: "home.projects.luma.description",
    gradient: "from-orange-500/10 to-red-600/5",
    internal: true,
  },
  {
    id: "haven",
    href: "/prototypes/haven",
    stack: ["React", "TypeScript", "Tailwind CSS", "Grid Layout"],
    status: "prototype",
    titleKey: "home.projects.haven.title",
    descKey: "home.projects.haven.description",
    gradient: "from-teal-500/10 to-cyan-600/5",
    internal: true,
  },
  {
    id: "safi",
    href: "/prototypes/safi",
    stack: ["React", "TypeScript", "Tailwind CSS", "Document UI"],
    status: "prototype",
    titleKey: "home.projects.safi.title",
    descKey: "home.projects.safi.description",
    gradient: "from-indigo-500/10 to-violet-600/5",
    internal: true,
  },
];
