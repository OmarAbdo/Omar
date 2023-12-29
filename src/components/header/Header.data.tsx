import {
  BeakerIcon,
  SparklesIcon,
  PaintBrushIcon,
  CpuChipIcon,
  ServerStackIcon
} from "@heroicons/react/24/outline";

export const articleCategories = [
  {
    name: "Frontend",
    description: "Web design, SPAs, CLIs, and Browser APIs",
    href: "#",
    icon: PaintBrushIcon,
  },
  {
    name: "Backend",
    description: "Rest APIs, Backend architecture, and Databases",
    href: "#",
    icon: ServerStackIcon,
  },
  {
    name: "Computer science",
    description: "Algorithms, Data structure, and all the fancy stuff!",
    href: "#",
    icon: CpuChipIcon,
  },
  {
    name: "CI/CD",
    description: "Continues integration with Docker, Kubernetes, and Git",
    href: "#",
    icon: SparklesIcon,
  },
  {
    name: "Others",
    description: "Testing, AI tools, and other trends!",
    href: "#",
    icon: BeakerIcon,
  },
];