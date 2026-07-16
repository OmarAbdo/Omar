import {
  ServerStackIcon,
  CpuChipIcon,
  CloudIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

export const services = [
  {
    id: 1,
    icon: ServerStackIcon,
    titleKey: "home.services.distributed.header",
    descKey: "home.services.distributed.subHeader",
  },
  {
    id: 2,
    icon: CpuChipIcon,
    titleKey: "home.services.aiSystems.header",
    descKey: "home.services.aiSystems.subHeader",
  },
  {
    id: 3,
    icon: CloudIcon,
    titleKey: "home.services.architecture.header",
    descKey: "home.services.architecture.subHeader",
  },
  {
    id: 4,
    icon: ChartBarIcon,
    titleKey: "home.services.consultancy.header",
    descKey: "home.services.consultancy.subHeader",
  },
];
